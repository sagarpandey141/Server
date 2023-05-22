const express=require("express");
const router=express.Router();

const {
    login,
    signUp,
    changePassword,
    otpGenerate,
}=require("../controller/Auth");
const{resetPasswordLink,resetPassword}=require("../controller/resetPassword");

const{Auth}=require("../middleware/auth");

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

router.post("/login",login);
router.post(".signup",signUp);
router.post("/sendotp",otpGenerate);
router.post("/changepassword",Auth,changePassword);


// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

router.post("reset-password-link",resetPasswordLink);
router.post("resetpassword",resetPassword);

module.exports=router;