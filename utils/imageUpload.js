const cloudinary=require("cloudinary").v2

exports.imageUploadToCloudinary=async(file,folder,hieght,quality)=>{
   const options={folder};

   if(hieght){
    options.hieght=hieght;
   }

   if(quality){
    options.quality=quality;
   }

   return await cloudinary.uploader.upload(file.tempFilePath,folder);
}