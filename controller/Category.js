const User=require("../model/User");
const Category=require("../model/category");

exports.createCategory=async(req,res)=>{
     try{
        //fetch data 
        const{name,decsription}=req.body;

        //validation
        if(!name || ! decsription){
            res.status(401).json({
                sucess:false,
                message:"All Fields Are Required",
            })
        }

        //save in db
        const dbSave=await Category.create({
            name:name,
            decsription:decsription,
        });

        res.status(200).json({
            sucess:false,
            message:"Tag creates SuccessFully",
        })
     } catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
     }
}

exports.showAllCategory=async(req,res)=>{
     try{
          
       const AllCategory=await Category.find({},{name:true,decsription:true});

       res.status(200).json({
          success:true,
          AllCategory,
          message:"Tag Fetched SuccessFully",
       })

     } catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
     }
}

exports.categoryPageDetail=async(req,res)=>{
    try{
         //fetch category id from request
         const{categoryid}=req.body;
          //get courses for specified categoryId
          const specifiedCategory=await Category.findById({categoryid})
                                                 .populate("course")
                                                 .exec()
          if(!specifiedCategory){
            return res.json(500).json({
                success:false,
                message:"Data not Found"
            })
          } 
           //get courses for unspecified categoryId
           const randomCategory=await Category.findById({
                                        _id:{$ne:categoryid}
           })
           .populate("course")
           .exec();

           //HW TODO GET 10 HIGH SELLING COURSE
           
           return res.status(200).json({
              success:false,
              data:{
                specifiedCategory,
                randomCategory,
              }
           })
          
    }   
          
     catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
