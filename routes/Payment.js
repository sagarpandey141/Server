const express=require("express");
const router=express.Router();

const {
    createOrder,
    verifySignature
}=require("../controller/Payment");

const {Auth,Student,isAdmin,isInstructor}=require("../middleware/auth");

router.post("/createOrder",Auth,Student,createOrder);
router.post("verifySignature",verifySignature);

module.exports=router;
