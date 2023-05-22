const OTP=require("../model/otp");
const User=require("../model/User");
const otpGenerator=require("otp-generator");
const bcrypt=require("bcrypt");
const Profile=require("../model/profile");
const jwt=require("jsonwebtoken");
const mailSender=require("../utils/mailSender")

exports.otpGenerate= async(req,res)=>{
        
       
     try{
        //fetch email
        const {email}=req.body;
           //check in db
        const checkUserPresent= await User.findOne({email});
          //if present send response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"email already exist try different email",
            })
        }
     //genretae otp
     var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
    });
    const result = await OTP.findOne({ otp: otp });
    console.log("Result is Generate OTP Func");
    console.log("OTP", otp);
    console.log("Result", result);
    while (result) {
        otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
        });
    }

        const otpPayload={email,otp};
              //store in db
        const otpbody= await OTP.create(otpPayload);
        console.log(otpbody);

          res.status(200).json({
         success:true,
         message:"otp created successfully",
       })

     } catch(err){
        res.status(401).json({
            success:false,
            message:"error while generating otp",
        })
     }
}

exports.signUp=async (req,res)=>{
     try{
        //data fetch
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            otp,
            contactNumber,
        }=req.body;
           //validation
        if(!email || !password || !confirmPassword || !otp || !firstName|| !lastName){
            res.status(401).json({
                success:false,
                message:"All Field Are Required Please Fill All The Detail",
            });
        }


          // Check if password and confirm password match
		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message:
					"Password and Confirm Password do not match. Please try again.",
			});
		}


        //check in Db if user is already present
        const dbChecking= await User.findOne({email});
        if(dbChecking){
            res.status(401).json({
                success:false,
                message:"User already exist try different email",
            })
        }

        //find most recent otp in dB
        const recentOtp= await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
        if(recentOtp.length===0){
         return   res.status(401).json({
                success:false,
                message:"OTP Not Found",
            })           
        }
       
       else if(otp!==recentOtp[0].otp){
           return res.status(401).json({
                success:false,
                message:"OTP Is Invalid",
            })   
        }

        //hashing 
          let hashedPassword= await bcrypt.hash(password,10);
         
          //create a user
          let approved="";
          approved==="Instructor" ? (approved=false):(approved=true);
          const profileDetail=await Profile.create({
             gender:null,
             dateOfBirth:null,
             about:null,
             contactNumber:null,
          })

          //db save
          const user=await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            approved:approved,
            contactNumber,
            accountType,
            additionalDetail:profileDetail,
            Image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
          })

        return  res.status(200).json({
            success:true,
            message:"Sign in successfully",
          })

     } catch(err){
        res.status(401).json({
            success:false,
            message:"error while Signing In",
        })
     }
}

exports.login=async(req,res)=>{
    try{
        //email and password fetch
        const {email,password}=req.body;
       
        //validation
        if(!email || !password){
            res.status(401).json({
                success:false,
                message:"All Field Are Required Please Fill All The Detail",
            })
        }

        //db check if user exit or not
        const user=await User.findOne({email}).populate("additionalDetail");

        if(!user){
            res.status(401).json({
                success:false,
                message:"Sign Up First",
            })}
            //jwt token
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                accountType:user.accountType,
                id:user._id,
            }

            let token=jwt.sign(payload,process.env.SECRET_KEY,{
                expiresIn:"2h",
            });
            user.token=token;
            user.password=undefined;
            const option={
                expires: new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,option).status(200).json({
                success:true,
                 token,
                 user,
                 message:"Log In SuccessFully",
            })
        }
        else{
                 res.status(500).json({
                    success:false,
                    message:"password Doesnt Matches",
                 })
        }

    } catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:'Login Failure, please try again',
        });
    }
}

exports.changePassword=async(req,res)=>{
    try{
          //fetch data
          const userDetail=await User.findById(req.user.id);
          const {
          
            oldpassword,
            newPassword,
            confirmPassword,
        }=req.body;
    
        //validation
        // Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldpassword,
			userDetail.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}
        

        // Match new password and confirm new password
		if (newPassword !== confirmPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}
       

        	// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

         
		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

        res.status(200).json({
            success:false,
            message:"password changed SuccessFully",
        })
    } catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:'CouldnT Change Password Please Try Again letter With Correct Email and Password',
        });
    }
   
   
}

