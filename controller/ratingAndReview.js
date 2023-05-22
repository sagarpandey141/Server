const Course=require("../model/courses")
const RatingAndReview=require("../model/RatingAndReview")
const { mongo, default: mongoose } = require("mongoose");

exports.createRating=async(req,res)=>{
    try{
          //data fetch
         
     const userId=req.user.id;
     const {rating,review,courseId} = req.body;

     //validation
     const courseDetail=await Course.findOne(
        {_id:courseId,
            studentEnrolled: {$elemMatch: {$eq: userId} },
    });

        if(!courseDetail){
          return res.status(401).json({
            success:false,
            message:'Student is not enrolled in the course',
          })
        }

        const alreadyReviewed=await RatingAndReview.findOne({
           user:userId,
            course:courseId,
        })

        if(alreadyReviewed){
            return res.status(400).json({
                success:false,
                message:"Course is Already Reviewed By The User "
            })
        }

        const createRaReview=await RatingAndReview.create({
            rating,
            review,
            course:courseId,
            user:userId,
        })
         //update course
         const updateCourse=await Course.findByIdAndUpdate(
            {_id:courseId},
           { 
            $push:{
                ratingAndReview:createRaReview._id
            }
           },
           {new:true},
         )
         console.log(updateCourse);
      return  res.json(200).json({
            success:true,
            message:"Rating Submitted SuccessFully",
            createRaReview,
        })

       
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

exports.getAverageRating=async(req,res)=>{
    try{
       
        //data fetch
        const courseid=req.body.courseid;
        
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseid),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating: { $avg: "$rating"},
                }
            }
        ])

        if(result.length>0){
            return res.json(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
        }

        return res.status(200).json({
            success:true,
            message:"Average Rating is 0, no ratings given till now",
            averageRating:0,
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

exports.getAllRating=async(req,res)=>{
    try{
        const allRating=await RatingAndReview.find({})
                                              .sort({rating:"desc"})
                                              .populate({
                                                    path:"user",
                                                   select:"firstName lastName email images"
                                              })
                                              .populate({
                                                path:"course",
                                                select:"courseName",
                                              })

                                             return res.status(200).json({
                                                success:true,
                                                message:"All Rating Fetched SuccessFully",
                                                data:allRating,
                                             })
                                              
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}