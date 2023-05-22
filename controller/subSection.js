const subSection=require("../model/subSection");
const section=require("../model/Section");
const {imageUploadToCloudinary}=require("../utils/imageUpload")
require("dotenv").config();

exports.createsubSection=async(req,res)=>{
    try{
        //data fetch
        const{title,description,sectionid}=req.body;
        //extract files
        const videoFile=req.files.videoFile;
        //validation
        if(!title  || ! description  || !sectionid){
            return res.status(401).json({
                success:false,
                message:"All Field Are Required",
             })
        }
        //upload videofile to cloudinary
        const uploadvideoCloud=await imageUploadToCloudinary(videoFile,process.env.FOLDER_NAME);
         //create subsection
         const savesubsection=await subSection.create({
            title:title,
            timeDuration:`${uploadvideoCloud.duration}`,
            description:description,
            videoUrl:uploadvideoCloud.secure_url,
         })
         // update section
      const updatedSection =await section.findByIdAndUpdate(
            {sectionid},
            {
                $push:{
                    subSection:savesubsection._id,
                }
            },
            {new:true},
         ).populate("subSection")
         //res
         res.status(200).json({
            success:true,
            message:"successFully created sub Section"
         })


    } catch(error){
        res.status(500).json({
            success:false,
            message:"error while Creating subSection",
           error:error,
         })
    }
}

exports.updateSubSection=async(req,res)=>{
    try{
          //data feth
          const {title,description,subSectionid}=req.body;
          const subSection=await subSection.findById(subSectionid)
          //update
          if (!subSection) {
            return res.status(404).json({
              success: false,
              message: "SubSection not found",
            })
          }
      
          if (title !== undefined) {
            subSection.title = title
          }
      
          if (description !== undefined) {
            subSection.description = description
          }
          if (req.files && req.files.video !== undefined) {
            const video = req.files.video
            const uploadDetails = await uploadImageToCloudinary(
              video,
              process.env.FOLDER_NAME
            )
            subSection.videoUrl = uploadDetails.secure_url
            subSection.timeDuration = `${uploadDetails.duration}`
          }
      
          await subSection.save()
          res.status(200).json({
            success:true,
            message:"successFully Updated sub Section"
         })

    } catch(error){
        res.status(500).json({
            success:false,
            message:"error while Updating subSection",
           error:error,
         })
    }
}


exports.deletesubSection=async(req,res)=>{
    try{
         //data fetch
         const { subSectionId, sectionId } = req.body
         await section.findByIdAndUpdate(
           { _id: sectionId },
           {
             $pull: {
               subSection: subSectionId,
             },
           }
         )
         const subSection = await subSection.findByIdAndDelete({ _id: subSectionId })
     
         if (!subSection) {
           return res
             .status(404)
             .json({ success: false, message: "SubSection not found" })
         }
         res.status(200).json({
             success:true,
             message:'Sub-Section Deleted SuccessFully'
         })

    } catch(error){
        res.status(500).json({
            success:false,
            message:"error while Deleting Sub-Section",
           error:error,
         })
    }
}

//HW: updateSubSection(done)

//HW:deleteSubSection(done)