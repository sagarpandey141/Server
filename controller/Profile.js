const User=require("../model/User");
const Profile=require("../model/profile");
const { imageUploadToCloudinary } = require("../utils/imageUpload");


exports.updateProfile=async(req,res)=>{
    try{
       //data fetch
       const {gender,contactNumber,DateOfBirth="",about=""}=req.body;
       //fetch id from params
       const{userid}=req.user.id;
       //validation
       if(!gender || ! contactNumber){
        res.status(401).json({
            success:false,
            message:"All Field Are Required",
        })
       }
       //update profile
       const userInfo=await User.findById({userid});
       const profileInfo=userInfo.additionalDetail;
       const Finalinfo=await Profile.findById({profileInfo});

       Finalinfo.DateOfBirth=DateOfBirth,
       Finalinfo.gender=gender,
       Finalinfo.contactNumber=contactNumber,
       Finalinfo.about=about,
       await Finalinfo.save();

       //response
       res.status(200).json({
        sucess:true,
        message:"Profile Updated SuccessFully",
    });

    } catch(error){
        res.status(500).json({
            success:false,
            message:"error while Updating Profile",
          error,
         })
    }
}

//delete profile
//Explore -> how can we schedule this deletion operation(done)
exports.deleteProfile=async(req,res)=>{
    try{
          //data fetch
          const{userid}=req.user.id;
          //validation
          if(!userid){
            res.status(401).json({
                success:false,
                message:"All Field Are Required",
            })
          }
          //delete profile
          await Profile.findByIdAndDelete({_id:userid.additionalDetail});
          //delete from enrolled course TODO
          await User.findByIdAndDelete({userid});
          //response
          res.status(200).json({
            sucess:true,
            message:"Profile Deleted SuccessFully",
          })

    } catch(error){
        res.status(500).json({
            success:false,
            message:"error while Deleting Profile",
          error,
         })
    }
}

//get all user
exports.GetallProfile=async(req,res)=>{
    try{
      //TODO CHECK
       //data fetched
       const id=req.user.id;
       //db call
       const userInfo=await User.findById(id).populate("additionalDetail").exec();
       //response
       res.status(200).json({
        sucess:true,
        message:"User Fetched SuccessFully",
        data:userInfo,
      })
    } catch(error){
        res.status(500).json({
            success:false,
            message:"error while  Fetching User Data",
          error,
         })
    }
}


exports.getAllEnrolledCourses=async(req,res)=>{
  try{
        //data fetch
        const {userid}=req.user.id;
        //db call
        const userDetail=await User.findById(userid).populate("courses").exec();
        if(!enrolledcourse){
          return res.status(400).json({
            success:true,
            message:`Could Not Find User With This ${userDetail}`,
          })
        }

        return res.status(200).json({
          success:true,
          data:userDetail.courses,
        })

  } catch(error){
         res.status(500).json({
          success:false,
           message:"error while  Fetching User Data",
            error,
      })
  }
}

exports.updateProfilePicture=async(req,res)=>{
  try{
       //data fetch
       const displayPicture=req.files.displayPicture;
       const {userid}=req.user.id;

       const image=imageUploadToCloudinary(
         displayPicture,
         process.env.FOLDER_NAME,
         1000,
         1000,
       )

       console.log(image);
   
       const updatedProfile=await User.findByIdAndUpdate(
        {userid},
        {image:image.secure_url},
        {new:true},
       )

       res.status(200).json({
        success:true,
        message:"image updated SuccessFully",
        data:updatedProfile
       })

  } catch(error){
    res.status(500).json({
      success:false,
       message:"error while  Fetching User Data",
        error,
  })
  }
}