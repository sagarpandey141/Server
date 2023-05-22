const mongoose=require("mongoose");

const RatingAndReview=new mongoose.Schema({
   user:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
   }],

   rating:{
    type:Number,
    required:true,
   },

   reviews:{
    type:String,
    required:true,
   },

   course: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Course",
		index: true,
	},
})

module.exports=mongoose.model("RatingAndReview",RatingAndReview);