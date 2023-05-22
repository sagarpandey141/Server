const express=require("express");
const app=express();

//import router
const userRoutes=require("./routes/User");
const profileRoutes=require("./routes/Profile");
const paymentRoutes=require("./routes/Payment");
const courseRoutes=require("./routes/course")

const database=require("./config/database");
database.connect();

const {cloudinaryConnect}=require("./config/cloudinary");
cloudinaryConnect();

//middleware
const cookieParser=require("cookie-parser");
const cors=require("cors");
const fileUpload=require("express-fileupload");
const dotenv=require("dotenv");
dotenv.config();
PORT=process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true,
    })
)

app.use(
    fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)

app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/payment",paymentRoutes);
app.use("/api/v1/course",courseRoutes);

app.get("/",(req,res)=>{
    return res.json({
		success:true,
		message:'Your server is up and running....'
	});
})

app.listen(PORT,()=>{
    console.log(`your port is running on this ${PORT}`)
})

