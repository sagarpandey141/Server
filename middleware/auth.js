const User=require("../model/User");
require("dotenv").config();
const jwt=require("jsonwebtoken");

exports.Auth=async(req,res,next)=>{
    try{
        //extract
        const token=req.body.token || req.cookies.token || req.header("Authorisation").replace("Bearer","");

        if(!token){
            res.status(500).json({
                sucess:false,
                message:"error while extracting token",
            })
        }
        
        try{

        const decode=jwt.verify(token,process.env.JWT_SECRET );
        console.log(decode);
        req.user=decode
        
        } catch(err){
            console.log(err);
            res.status(401).json({
                sucess:false,
                message:"Token is invalid",
            })
        }

       next();

    } catch(err){
        return res.status(401).json({
            success:false,
            message:'Something went wrong while validating the token',
        });
    }

}

exports.Student=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Student"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Student only',
            });
        }
        next();
    } catch(err){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again'
        })
    }
}

exports.isAdmin=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Admin only',
            });
        }
        next();
    } catch(err){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again'
        })
    }
}
exports.isInstructor=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for Instructor only',
            });
        }
        next();
    } catch(err){
        return res.status(500).json({
            success:false,
            message:'User role cannot be verified, please try again',
        })
    }
}
