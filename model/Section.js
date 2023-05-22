const mongoose=require("mongoose");
const { subSection } = require("./subSection");

const sectionSchema=new mongoose.Schema({
     sectionName:{
        type:String,
     },

     subSection:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"subSection",
        required:true,
     }],
})

module.exports=mongoose.model("Section",sectionSchema);