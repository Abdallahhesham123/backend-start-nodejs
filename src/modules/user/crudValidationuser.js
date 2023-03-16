import joi from "joi";
import { fileValidationGeneral } from "../../middleware/validation.js";


export const profilePic = {

  file:fileValidationGeneral.file.required().messages({
    //.options({allowUnknown:true})
      "any.required":"Please Choose Your profile Picture"
    }),
}

export const updateSchema = {
    body: joi.object({
      username: joi.string().alphanum().min(3).max(20).messages({
        "string.empty":"Please fill your username field"
      }),
      email: joi.string()
      .email({ minDomainSegments: 2 ,maxDomainSegments:3 ,tlds:{allow:["com","net"]}})
      .messages({
        "string.empty":"Please fill your email field"
      }),
      FirstName: joi.string().alphanum().min(3).max(20).messages({
        "string.empty":"Please fill your username field"
      }),
      LastName: joi.string().alphanum().min(3).max(20).messages({
        "string.empty":"Please fill your username field"
      }),
      age:joi.number().integer().min(16).max(120).messages({
        "number.min":"your age should be greater than 16 years",
        "number.max":"your age should be less than 120 years",
      }),
      gender:joi.string().valid('Male',"Female").messages({
        "any.only":"gender field must be male or female"
      }),
     
      status:joi.string().valid('Online',"Offline").messages({
        "any.only":"gender field must be Online or Offline"
      }),
      phone:joi.string().pattern(
        new RegExp(/^01[0125][0-9]{8}$/)),
        Profilepic:joi.string(),
        Coverpic:joi.string()
    }).required(),
    headers: joi.object({
        'authorization': joi.string().required().messages({
            "any.required":"headers must have  abearerkey"
        }),
    }).options({ allowUnknown: true })
  };
  export const headersSchema ={
    headers: joi.object({
      'authorization': joi.string().required().messages({
          "any.required":"headers must have  abearerkey"
      })
  }).options({ allowUnknown: true })

  }