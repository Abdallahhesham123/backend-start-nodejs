import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import UserModel from "./../../DB/model/User.model.js";
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";
dotenv.config()
const {JWT_SECRET_KEY ,BEARER_KEY} = process.env;
export const AuthUser = async(req, res, next) => {
  try {
    const headers = req.headers[`authorization`];
    if(!headers?.startsWith(BEARER_KEY)){

      return res.status(404).json({message:"Invalid authorization BarearKey"});
    }

const token = headers.split(BEARER_KEY)[1]
if(!token){
  return res.status(404).json({message:"Token is Required"});


}

const decoded=verifyToken({

  token,
  signature:JWT_SECRET_KEY
})

if(!decoded?.id || !decoded?.isLoggedIn){
  return res.status(404).json({message:"INVALID TOKEN PAYLOAD"});

}

const authUser = await UserModel.findById(decoded.id).select("username email role")
if(!authUser){
  return res.status(404).json({message:"you arenot authorized"});

}

req.user = authUser
return next();
  } catch (error) {
    
  return res.json({
    message: "Catch error",
    error,
    stack: error.stack,
  });
  }

}