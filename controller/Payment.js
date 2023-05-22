const { default: mongoose } = require("mongoose");
const {instance}=require("../config/razorPay")
const Course=require("../model/courses")
const User=require("../model/User")
const mailsender=require("../utils/mailSender")
exports.createOrder=async(req,res)=>{
    try{
         //fetch userid and course id
         const {courseid}=req.body;
         const{userid}=req.user.id;
         //validation
         if(!courseid){
            return res.status(401).json({
                success:false,
                message:"Please Send CourseId"
            })
         }

         let course;
         try{
              course=await Course.findById(courseid);

              if(!course){
                return res.status(401).json({
                    success:false,
                    message:"Course Detail Are Not  Valid"
                })
              }
           //check user if user has buy the course before
           const uid=mongoose.Types.ObjectId(userid);

           if(course.studentEnrolled==uid){
            return res.status(401).json({
                success:false,
                message:"Already Purchase The  Course"
            })}
           

         } catch(error){
            res.status(500).json({
                success:false,
                message:error.message,
             
             })}

             //options create
             const amount=course.price;
             const currency="INR";
            const options={
                amount:amount*100,
                currency,
                reciept:Math.floor(Date.now().toString()),
                notes:{
                    courseid,
                    userid,
                }

            }

            try{
              //Intiate the Payment with Razorpay
              const paymentResponse=await instance.orders.create(options);
              console.log(paymentResponse);
            } catch(error){
                 console.log(error);
               return  res.status(500).json({
                       success:false,
                       message:"error while Intiating the Payment with Razorpay"
                 })
            }
            //response
            res.status(200).json({
                success:true,
                coureName:course.coureName,
                courseDescription:course.courseDescription,
               thumbnail:course.thumbnail,
               order_id:paymentResponse.id,
               currency:paymentResponse.currency,
               amount:paymentResponse.amount,
            })
         
    } catch(error){
         console.log(error);
         res.json({
            success:false,
            message:"Could Not intiate order"
         })
    }
}

exports.verifySignature=async(req,res)=>{
   
          const webhookSecret="12345";
          const signature=req.headers("x-razorpay-signature");

        const shasum=crypto.createHmac("sha256",webhookSecret);
        shasum.update(json.stringify(req.body));
        const digest=shasum.digest("hex");
     
        if(signature===digest){
               console.log("payment is Authorized");
               
               const{courseid,userid}=req.body.payload.entity.notes;
               try{
                    //action fuflfill

                    //find the course and enroll the student in course
                   const enrolledcourse=await Course.findByIdAndUpdate(
                    {_id:courseid},
                    {
                        $push:{
                            studentEnrolled:userid,
                        }
                    },
                    {new:true},
                   )

                   if(!enrolledcourse){
                    return res.status(500).json({
                        success:false,
                        message:"Course not found",
                    });
                }
                   console.log(enrolledcourse);

                   //findthe student and push course id in list of enrolled course
                   const enrolledstudent=await User.findOneAndUpdate(
                    {_id:userid},
                    {
                        $push:{
                            courses:courseid,
                        }
                    
                    },
                    {new:true},
                   )
                  console.log(enrolledcourse);
                  //mail send of confirmation
                  const emailResponse=await mailsender(
                                 enrolledcourse.mail,
                                 "congrahulation from Codehelp",
                                 "Congrahulation you are onboarded into new Codehelp course",
                  )

                  console.log(emailResponse);
                 return res.status(200).json({
                    success:true,
                   message:"Signature Verifies and Course Added"
                })

               } catch(error){
                       console.log(error);
                       return res.status(500).json({
                        success:false,
                       message:error.message,
                    })
               }
        }
        else{
            return res.status(500).json({
                success:false,
               message:"Invalid Signature",
            })
        }

}