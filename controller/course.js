const User=require("../model/User");
const Category=require("../model/category");
const { imageUploadToCloudinary } = require("../utils/imageUpload");
require("dotenv").config();
const Course=require("../model/courses");

exports.createCourse=async(req,res)=>{
   try{
     //data fetch
     let{courseName, courseDescription, whatYoutWillLearn, price, Category,status,instructions}=req.body;

     const thumbnail=req.files.thumbnailImage;
     //valiation
     if(!courseName || !courseDescription || !whatYoutWillLearn || ! price || !Category || !thumbnail){
         res.status(401).json({
             success:false,
             message:"All Field Are Required",
         })
     }
      
     if (!status || status === undefined) {
        status = "Draft";
    }

     //find instructor
     const userId=req.user.id;
     const instructorDetails = await User.findById(userId);
     console.log("Instructor Details: " , instructorDetails);
     //TODO: Verify that userId and instructorDetails._id  are same or different ?
 
     if(!instructorDetails){
         res.status(401).json({
             success:false,
             message:"Instructor Detail Not Found",
         })
     }
 
     const Categorycheck=await Category.find({Category});
 
     if(!Categorycheck){
         res.status(401).json({
             success:false,
             message:"Category not Found"
         })
     }
 
     //upload to cloudinary
     const thumbnailImage=await imageUploadToCloudinary(thumbnail,process.env.FOLDER_NAME);
 
     const newCourse=await Course.create({
            courseName,
            courseDescription,
            Instructor:instructorDetails,
            whatYoutWillLearn,
            Category:Categorycheck._id,
            thumbnail:thumbnailImage.secure_url,
            price,
            tag:tag,
            status:status,
            instructions:instructions,
     })
 
     await User.findByIdAndUpdate(
         {_id:instructorDetails._id},
         {
             $push:{
                 courses:newCourse._id,
             }
         },
         {new:true},
     )
       
     await Category.findByIdAndUpdate(
         {_id:Categorycheck._id},
         {
             $push:{
                 course:newCourse._id,
             }
         },
         {new:true},
     )
 
       //return response
       return res.status(200).json({
         success:true,
         message:"Course Created Successfully",
         data:newCourse,
     });
 
   } catch(err){
    console.error(err);
    return res.status(500).json({
        success:false,
        message:'Failed to create Course',
        error: err.message,
       })
   }
}

exports.courseFind=async(req,res)=>{
    try{
        const data=await Course.find({},{
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnroled: true,
        })

        .populate("instructor")
        .exec();
        return res.status(200).json({
            success:true,
            message:'Data for all courses fetched successfully',
            data:data,
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Cannot Fetch course data',
            error:error.message,
        })
    }
}

exports.getAllCourseDetail=async(req,res)=>{
    try{
           //data fetch
           const {courseid}=req.body;
          //db call
          const fetchedCourse=await Course.findById(
            {courseid})
            .populate({
                 path:"instructor",
                 populate:{
                    path:"additionalDetail"
                 }
            }
        )
        .populate("Category")
        .populate("ratingAndReview")
        .populate(
            {
                path:"courseContent",
                populate:{
                    path:"subSection"
                }
            }
        )
        .exec();

        if(!fetchedCourse){
            return res.status(500).json({
                success:false,
                message:`Could Not Find The Course With This ${courseid}`
            })
        }

        res.status(200).json({
            success:true,
            message:"Course Detail Fetched SuccessFully",
            fetchedCourse,
        })
            
          
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}