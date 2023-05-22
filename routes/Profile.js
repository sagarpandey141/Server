const express=require("express");
const router=express.Router();

const {
    updateProfile,
    deleteProfile,
    GetallProfile,
    getAllEnrolledCourses,
    updateProfilePicture

}=require("../controller/Profile");

const{Auth}=require("../middleware/auth")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account

router.delete("/deleteProfile",Auth,deleteProfile);
router.put("/updateProfile",Auth,updateProfile);
router.get("/getUserDetails",Auth,GetallProfile)
router.get("/getAllEnrolledCourses",Auth,getAllEnrolledCourses);
router.put("/updateDisplayPicture",Auth,updateProfilePicture);

