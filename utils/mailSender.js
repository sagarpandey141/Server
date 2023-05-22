const nodemailer=require("nodemailer");

exports.nodemamailSender=async (email,title,body)=>{

    try{
         
      let transporter=nodemailer.createTransport({
        host:process.env.Mail_Host,
        auth:{
            user:process.env.Mail_User,
            pass:process.env.Mail_Pass,
        }
      })

      let info=await transporter.sendMail({
        from:'StudyNotion ',
        to:`${email}`,
        subject:`${title}`,
        html:`${body}`,
      })

      console.log(info);
      return info;
      
    } catch(err){
      console.log(err.message)

    }
}