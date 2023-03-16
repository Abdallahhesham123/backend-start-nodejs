import UserModel from "../../../../DB/model/User.model.js";
import verifyModel from "../../../../DB/model/VerificationTokenEmail.js";
import { compare, hash } from "../../../utils/HashAndCompare.js";
// import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { generateToken, verifyToken } from "../../../utils/GenerateAndVerifyToken.js";
import { asyncHandler } from "../../../utils/errorHandling.js";
import { generateOtp } from "../../../utils/verification.js";
import transporter from "./../../../../DB/emailConfig.js";
import { isValidObjectId } from "mongoose";
import bcrypt from "bcrypt";

dotenv.config();
const { JWT_SECRET_KEY, EMAIL_FROM } = process.env;


export const getAuthModule =   (req, res, next) => {

    return res.json({ message: "Auth module" })
}

export const register = asyncHandler(async (req, res, next) => {
    const { username, password, email } = req.body;
    // console.log(req.body);
    const checkUser = await UserModel.findOne({ email });
    if (checkUser) {
  
      return next(new Error("Email Exist Please chose another Email",{cause :404}));
    }
  
    req.body.password = hash({ plaintext: password });
    const newUser = new UserModel(req.body);
  
    let OTP = generateOtp();
    // console.log(otp);
    const tokenVerify = hash({ plaintext: OTP });
  
    const newVerification = new verifyModel({
      owner: newUser._id,
      token: tokenVerify,
    });
  
    await newVerification.save();
    await newUser.save();
  // console.log(newUser);
    const link = `http://127.0.0.1:3000/verification-email/${newUser._id}`;
    const RefreshToken = generateToken({payload:{
      email: newUser.email
    },
    expiresIn: 60 * 60 * 24 * 30})
    const RefreshLink =`${req.protocol}://${req.headers.host}/auth/verification-email/${RefreshToken}`
    // Send Email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to:email,
      subject: "abdallah-Site - Verification Email Link",
      html: `     
      
      <!DOCTYPE html>
      <html>
      <head>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
      <style type="text/css">
      body{background-color: #88BDBF;margin: 0px;}
      </style>
      <body style="margin:0px;"> 
      <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
      <tr>
      <td>
      <table border="0" width="100%">
      <tr>
      <td>
      <h1>
          <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
      </h1>
      </td>
      <td>
      <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      <tr>
      <td>
      <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
      <tr>
      <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
      <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
      </td>
      </tr>
      <tr>
      <td>
      <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
      </td>
      </tr>
      <tr>
      <td>
      <p style="padding:0px 100px;">
      </p>
      </td>
      </tr>
      <tr>
      <td>
      <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
      </td>
      </tr>
      <tr>
      <td>
      <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">
      
      Please Enter Your pin code In form To verify Your email And Enter Site :  ${OTP}</p>
      </td>
      </tr>
      <tr>
      <td>
      <a href="${RefreshLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      <tr>
      <td>
      <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
      <tr>
      <td>
      <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
      </td>
      </tr>
      <tr>
      <td>
      <div style="margin-top:20px;">
  
      <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
      <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
      
      <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
      <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
      </a>
      
      <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
      <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
      </a>
  
      </div>
      </td>
      </tr>
      </table>
      </td>
      </tr>
      </table>
      </body>
      </html>
              
               `,
    });
    return res
      .status(200)
      .json({ message: "Successfully Register Please Logged In " });
  });
  
  export const login = asyncHandler(async (req, res, next) => {
    const { password, email } = req.body;
  console.log(req.body);
    const user = await UserModel.findOne({
      email: email,
      isDeleted: false
    });
  
    if (!user?.confirmEmail ===  true) {
      // return res.status(404).json({ message: "Invalid Email or password" });
      return next(new Error("you can not access to site without Confirm Email check your mail" ,{cause :404}));
    }
  
  
    if (!user) {
      // return res.status(404).json({ message: "Invalid Email or password" });
      return next(new Error("Invalid Email or password" ,{cause :404}));
    }
  
    const checkPassword = compare({
      plaintext: password,
      hashValue: user.password,
    });
  
    if (!checkPassword) {
      // return res.status(404).json({ message: "Invalid Email or password" });
      return next(new Error("Invalid Email or password" ,{cause :404}));
    }
  
    const token = generateToken({
      payload: {
        id: user._id,
        username: user.username,
        role: user.role,
        Profilepic: user.Profilepic,
        Coverpic: user.Coverpic,
        isLoggedIn: true,
      },
      expiresIn: 60 * 60 * 24 * 30,
    });
  
    user.status = "Online";
    user.save();
  
    return res.status(200).json({ message: "Successfully Logged In", token });
  });

  export const resetpassword = asyncHandler(async (req, res, next) => {
    const { oldpassword, password, confirm_pass } = req.body;
  
    const checkUser = await UserModel.findById(req.user._id);
   
  
    if (!checkUser) {

  
      return next(new Error("This User Isnot Exist in database" ,{cause :404}));
    } else {
      const checkPassword = compare({
        plaintext: oldpassword,
        hashValue: checkUser.password,
      });
      if (!checkPassword) {

        return next(new Error("password isnot exist in database" ,{cause :404}));
      }
    }
    const passwordHash = hash({ plaintext: password });
    await UserModel.findOneAndUpdate(
      { _id: req.user._id },
      {
        password: passwordHash,
      }
    );
    return res
      .status(200)
      .json({ message: "Congratulation ,Your Password Changed " });
  });
  
  export const verifyEmail = asyncHandler(async (req, res, next) => {
    const { otp, UserId } = req.params;
  // console.log(req.params);
    if (!otp.trim() || !UserId) {
      return next(new Error("Invalid Request Missing Parameters" ,{cause :404}));
    }
    if (!isValidObjectId(UserId)) {
      return next(new Error("Invalid UserId"));
    }
    const user = await UserModel.findById(UserId);
    if (!user) {
      // return res.status(404).json({ message: "Invalid Email or password" });
      return next(new Error("Sorry, UserNot found" ,{cause :404}));
    }
  
    if (user.confirmEmail === true) {
      return next(new Error("This account is already confirmed" ,{cause :404}));
    }
    const userAccount = (user._id).toString();
    // console.log(user._id);
    const tokenVerifiedModel = await verifyModel.findOne({ owner: userAccount});
    if (!tokenVerifiedModel) {
      return next(new Error("This User is not found , Please Check Your Pin code" ,{cause :404}));
    }
  
    const checkTokenVerified = compare({
      plaintext: otp,
      hashValue: tokenVerifiedModel.token,
    });
  
    if (!checkTokenVerified) {
      return next(new Error("This is an error Match Verification" ,{cause :404}));
    }
  
    user.confirmEmail = true;
  
    await verifyModel.findByIdAndDelete(tokenVerifiedModel._id);
    const token = generateToken({
      payload: {
        id: user._id,
        role: user.role,
        Profilepic: user.Profilepic,
        Coverpic: user.Coverpic,
        isLoggedIn: true,
        confirmEmail:true
      },
      expiresIn: 60 * 60 * 24 * 30,
    });
  
    user.status = "Online";
    user.save();
  
    return res.status(200).json({ message: "this email is verified", token });
  });
  export const sendingemail = async (req, res, next) => {
    try {
      const { email } = req.body;
  
      if (email) {
        const user = await UserModel.findOne({ email: email });
        if (user) {
          const secret = user._id + JWT_SECRET_KEY;


          const token = generateToken({payload:{
            userID: user._id
          },signature:secret,
          expiresIn: 60*5})

          console.log(token);
          const link = `http://127.0.0.1:3000/reset-password/${user._id}/${token}`;
          // Send Email
          const info = await transporter.sendMail({
            from: EMAIL_FROM,
            to: user.email,
            subject: "abdallah-Blog - Password Reset Link",
            html: `
            
            
            
                    
                  
            <!DOCTYPE html>
            <html>
            <head>
                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
            <style type="text/css">
            body{background-color: #88BDBF;margin: 0px;}
            </style>
            <body style="margin:0px;"> 
            <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
            <tr>
            <td>
            <table border="0" width="100%">
            <tr>
            <td>
            <h1>
                <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
            </h1>
            </td>
            <td>
            <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
            </td>
            </tr>
            </table>
            </td>
            </tr>
            <tr>
            <td>
            <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
            <tr>
            <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
            <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
            </td>
            </tr>
            <tr>
            <td>
            <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
            </td>
            </tr>
            <tr>
            <td>
            <p style="padding:0px 100px;">
            </p>
            </td>
            </tr>
            <tr>
            <td>
            <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Reset Your Password</a>
            </td>
            </tr>
            </table>
            </td>
            </tr>
            <tr>
            <td>
            <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
            <tr>
            <td>
            <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
            </td>
            </tr>
            <tr>
            <td>
            <div style="margin-top:20px;">
        
            <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
            <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
            
            <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
            <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
            </a>
            
            <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
            <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
            </a>
        
            </div>
            </td>
            </tr>
            </table>
            </td>
            </tr>
            </table>
            </body>
            </html>
            
            
            `,
          });
          res
            .status(200)
            .json({
              message: "Password Reset Email Sent... Please Check Your Email",
            });
        } else {
          res.status(404).json({ message: "Email doesn't exists" });
        }
      } else {
        res.status(404).json({ message: "Email Field is Required" });
      }
    } catch (err) {
      return res.status(404).json({ message: "Catch Error", err });
    }
  };
  
  export const userPasswordResetGen = async (req, res, next) => {
    const { password, confirm_pass } = req.body;
    const { id, token } = req.params;
    console.log(JWT_SECRET_KEY)
    const user = await UserModel.findById(id);
    const new_secret = user._id + JWT_SECRET_KEY;
  
    try {

      verifyToken({token,signature:new_secret})
      if (password && confirm_pass) {
        if (password !== confirm_pass) {
          res
            .status(404)
            .json({
              message: "New Password and Confirm New Password doesn't match",
            });
        } else {
          const salt = await bcrypt.genSalt(10);
          const newHashPassword = await bcrypt.hash(password, salt);
          await UserModel.findByIdAndUpdate(user._id, {
            $set: { password: newHashPassword },
          });
          res.status(200).json({ message: "Password Reset Successfully" });
        }
      } else {
        res.status(404).json({ message: "All Fields are Required" });
      }
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: "Invalid Token" });
    }
  };
  export const verifyRefreshEmail = async(req,res ,next)=>{
    const {token}=req.params;
  const {email}=verifyToken({token})
  
  
  const link = `${req.protocol}://${req.headers.host}/auth/confirmation-email/${token}`;
  const RefreshToken = generateToken({payload:{
    email
  },
  expiresIn: 60 * 60 * 24 * 30})
  const RefreshLink =`${req.protocol}://${req.headers.host}/auth/verification-email/${RefreshToken}`
  // Send Email
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "abdallah-Site - Verification Email Link",
    html: `     
    
    <!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
    </td>
    </tr>
  
    <tr>
    <td>
    <a href="${RefreshLink}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">
  
    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
    
    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
    </a>
    
    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
    </a>
  
    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>
    
            
            
             `,
  });
  return res
    .status(200)
    .send("<p>Done Please Check Your mail</p>");
  }
  
  export const confirmationEmail = async(req,res,next)=>{
  
  
    const{token}= req.params;
    const{email}=verifyToken({token});
    const user = await UserModel.updateOne({email},{confirmEmail:true})
    return user.modifiedCount ? res.status(200).redirect("https://github.com/")
    :res.status(404).send("not register account")
  }
  