const mongoose=require("mongoose");

const courseProgres=new mongoose.Schema({
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Course',
    },

    completedVideo:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'subSection',
    }],
})

module.exports=mongoose.model("CourseProgress",courseProgres);