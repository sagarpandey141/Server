const User=require("../model/User");
const mailSender=require("../utils/mailSender")
const bcrypt=require("bcrypt")

exports.resetPasswordLink=async(req,res)=>{
    try{
        //data fetch from request
        const {email}=req.body;
        //check in dataBase if User Exists
        const user=await User.findOne({email});
        //send response if user dosent exists
        if(!user){
            res.status(500).json({
                sucess:false,
                message:"User Dosent Exists Please Sign In First",
            })
        }

        //generat link (we will diferentiate link by token)
        const token=crypto.randomBytes(20).toString("hex");

        const updatedDetail=await User.findOneAndUpdate(
            {email:email},
            {
                token:token,
                resetPasswordExpire:Date.now()+5*60*1000,
            },
            {new:true},
        )

        //link generation
        const url=`http:localhost:3000/updatepassword/${token}`;
     
        await mailSender(email,
                 "Password Reset Link",
               `password Reset Link:${url}`,
            )

            res.status(200).json({
                sucess:true,
                message:"Email sent successfully, please check email and change Password",
            });



    } catch(err){
        consolee.log(err);
       res.status(500).json({sucess:false,
        message:"error while sending mail for reseting password",
       });
    }
}

exports.resetPassword=async(req,res)=>{
    try{
        //fetch data from request
        const {password,confirmPassword,token}=req.body;
        //validation
        if(password!==confirmPassword){
            res.status(401).json({
                sucess:false,
                message:"password dosent match Please Try Again"
            })
        }

        //database check
        const dbCheck=await User.findOne({token:token});

        if(!dbCheck){
            res.status(500).json({
                sucess:false,
                message:"Token is Invalid",
            })
        }

        if(!(dbCheck.resetPasswordExpire <Date.now())){
            res.status(401).json({
                sucess:false,
                message:"Token expirse Please try again "
            })
        }
        //hashing password
        const hashedPassword= bcrypt.hash(10,password);

        const update=await User.findOneAndUpdate(
            {token:token},
            {
                password:hashedPassword,

            },
            {new:true},
        )
      
        res.status(200).json({
            sucess:true,
            message:"Password Change SuccessFully",
        });



    } catch(err){
        consolee.log(err);
        res.status(500).json({sucess:false,
         message:"error while  reseting password",
        });
    }
}