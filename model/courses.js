const mongoose=require("mongoose");

const courseSchema=new mongoose.Schema({
    courseName:{
        type:String,
    },
    courseDescription:{
        type:String,
    },

    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },

    whatYouWillLearn:{
        type:String,
    },

  courseContent:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Section',
    }],
    
    ratingAndReview:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'RatingAndReview',
    }],

    price:{
        type:String,
    },

    thumbnail:{
        type:String,
    },
     
    tag: {
		type: [String],
		required: true,
	},

    Category:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
    }],

    studentEnrolled:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    }],
   
    instructions: {
		type: [String],
	},
	status: {
		type: String,
		enum: ["Draft", "Published"],
	},
    
})

module.exports=mongoose.model("Course",courseSchema);