const Section=require("../model/Section");
const course=require("../model/courses");

exports.createSection=async(req,res)=>{
     try{
        //data fetch
        const {sectionName,courseid}=req.body;
        //validation
           if(!sectionName || !courseid){
             return res.status(401).json({
                success:false,
                message:"All Field Are Required",
             })
           }
        //create
        const createSec=await Section.create({
            sectionName
        });
        //course model ma update
        const updatecourse=await course.findByIdAndUpdate(
            {courseid},
            {
                $push:{
                    courseContent:createSec._id
                }
            }
        )   
        .populate({
            path: "courseContent",
            populate: {
                path: "subSection",
            },
        })
        .exec();
         //HW: use populate to replace sections/sub-sections both in the updatedCourseDetails
        //res

        res.status(200).json({
            success:true,
            message:"Section created successFully",
            updatecourse,
        })
     } catch(err){
         res.status(500).json({
            success:false,
            message:"error while Creating Section",
           error:err,
         })
     }
}

//check
exports.updateSection=async(req,res)=>{
    try{
          //data fetch
          const {sectionName,sectionid}=req.body;
          //validation
          if(!sectionName){
            return res.status(401).json({
                success:false,
                message:"All Field Are Required",
             })
          }
          //update
        const updatedsec =await Section.findByIdAndDelete(
            {sectionid},
            {
                sectionName,
            },
            {new:true},
          )

    }
    catch(error){
        res.status(500).json({
            success:false,
            message:"error while Creating Section",
           error:error,
         })
    }
}

exports.deleteSection=async(req,res)=>{
    try{
        //data fetch
        const {sectionid}=req.params;
        //validation
        if(!sectionid){
            return res.status(401).json({
                success:false,
                message:"All Field Are Required",
             })
        }
        //delete 
        await Section.findByIdAndDelete(
            sectionid
        )
         //TODO[Testing]: do we need to delete the entry from the course schema ??
        res.status(200).json({
            success:true,
            message:'Section Deleted SuccessFully'
        })

    } catch(err){
        res.status(500).json({
            success:false,
            message:"error while Deleting Section",
           error:err,
         })
    }
}