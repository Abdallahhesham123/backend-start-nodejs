import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config()
const {JWT_SECRET_KEY ,BEARER_KEY} = process.env;
export const generateToken= ({payload={},signature=JWT_SECRET_KEY ,expiresIn = 60*60}={})=>{
  
const token =jwt.sign(payload,signature,{expiresIn:parseInt(expiresIn)})
// console.log(token);

return token

}

export const verifyToken= ({token={},signature=JWT_SECRET_KEY }={})=>{
    const decoded =jwt.verify(token,signature)
    
    return decoded
    
    }