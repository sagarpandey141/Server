const mongoose=require("mongoose");
const mailSender=require("../utils/mailSender")
const otpSchema=new mongoose.Schema({
     email:{
        type:String,
        required:true,
     },
       otp:{
        type:String,
        required:true,
       },
     createdAt:{
        type:Date,
        default:Date.now(),
        expires:60*5,
     },
})

async function sendverificationEamil(email,otp){
     try{
          const mailresponse=await mailSender(email,"Verfication Email From StudyNotion",emailTemplate(otp));
          console.log("Email sent Successfully: ",mailresponse.response);
     } catch(err){
        console.log("error occured while sending mails: ", err);
        throw err;
     }
}

// Define a post-save hook to send email after the document has been saved
otpSchema.pre("save", async function (next) {
	console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		await sendverificationEamil(this.email, this.otp);
	}
	next();
});

module.exports=mongoose.model("OTP",otpSchema);