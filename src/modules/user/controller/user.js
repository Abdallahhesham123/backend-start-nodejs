import UserModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import cloudinary from "../../../utils/cloudinary.js";
export const getUser = async (req, res, next) => {
  try {
    const users = await UserModel.find();
    return res.json({ message: "Done", users });
  } catch (error) {
    return res.json({
      message: "Catch error",
      error,
      stack: error.stack,
    });
  }
};

export const findByIdAndUpdate = asyncHandler(async (req, res, next) => {
  const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
  const fullpath= path.join(__dirname, "../../../uploads/")
      const user = await UserModel.findByIdAndUpdate(
        { _id:req.user._id, isDeleted: false },
        {...req.body,Profilepic:req.file.dest},
        { new: false }
      ).select("age username gender Profilepic Coverpic")

        if(user.Profilepic && user.Profilepic !== req.body.Profilepic) {
    const newdata = user.Profilepic.replace("/","\\")
    fs.unlinkSync(`${fullpath}${newdata}`);
    
  }
      return user
        ? res.json({ message: "user Updated Sucsessfully", user })
        :  next(new Error("InValid-UserId"));
       
  });


  export const getProfile = asyncHandler(async (req, res, next) => {

    //   const { id } = req.params;
      const user = await UserModel.findOne({ _id: req.user._id, isDeleted: false ,confirmEmail:true })
      .select("-password -confirmEmail -isDeleted ")
      return user
        ? res.json({ message: "user Profile Founded Sucsessfully", user })
        : next(new Error("InValid-UserId"));
       
  });

      //it is return object without modifiedCount( hardDeleted== deleted from database)
export const findOneAndDelete = asyncHandler(async (req, res, next) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
    const fullpath= path.join(__dirname, "../../../uploads/")
  const user = await UserModel.findOneAndDelete({ _id: req.user._id, isDeleted: false }, { new: false });
  if(user.Profilepic && user.Profilepic !== req.body.Profilepic) {
    const newdata = user.Profilepic.replace("/","\\")
    fs.unlinkSync(`${fullpath}${newdata}`);
    
  }
  return user
    ? res.json({ message: "user Deleted Sucsessfully from database" })
    : next(new Error("InValid-UserId"));
    
});

export const profilePicUpdated = asyncHandler(async (req, res, next) => {

  const {secure_url ,public_id} =await cloudinary.uploader.upload(req.file.path, {folder:`user/${req.user._id}/profilePic`})

const user = await UserModel.findByIdAndUpdate(
  req.user._id,
  {Profilepic:secure_url , Profilepic_id:public_id} ,
  {new:false}
  )
  await cloudinary.uploader.destroy(user.Profilepic_id)
 return res.json({ message: "Done",user })

    
});

export const softDelete =asyncHandler( async (req, res, next) => {

  const user = await UserModel.updateOne(
    { _id:req.user._id, isDeleted: false },
    { isDeleted: true }
  );


  return user.modifiedCount
    ? res.json({
        message: "user deleted Sucsessfully but this user in database" })
    :  next(new Error("InValid-UserId"));
   
});

export const restoretodatabase = asyncHandler( async (req, res, next) => {

  
  const user = await UserModel.updateOne(
    { _id:req.user._id, isDeleted: true },
    { isDeleted: false }
  );


  return user.modifiedCount
    ? res.json({
        message: "user Restored Sucsessfully and your post Restored" })
    :  next(new Error("InValid-UserId"));
   
});