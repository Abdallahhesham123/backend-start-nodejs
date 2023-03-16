

import joi from "joi";
import { Types } from "mongoose";

const dataMethods = ["body", "query", "params", "headers","file"];


const validationObjectId=(value , helper)=>{

  return Types.ObjectId.isValid(value) ? true : helper.message("InValid-ObjectId")
}
export const fileValidationGeneral = {

  email: joi.string()
  .email({ minDomainSegments: 2 ,maxDomainSegments:3 ,tlds:{allow:["com","net"]}})
  .required().messages({
    "string.empty":"Please fill your email field",
    "any.required":"email field is required",
  }),
  password: joi
    .string()
    .pattern(
      new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
    )
    .required().messages({
      "string.empty":"Please fill your password field",
      "any.required":"password field is required",
    }),
  confirm_pass: joi.string().required().messages({
    "any.only":"this field must be matched with password field"
  }),
 id: joi.string().custom(validationObjectId).required().messages({
    "any.required":" receiverId is required"
}),
file:joi.object({
  size:joi.number().positive().required(),
  path :joi.string().required(),
  filename :joi.string().required(),
  destination :joi.string().required(),
  mimetype :joi.string().required(),
  encoding :joi.string().required(),
  originalname :joi.string().required(),
  fieldname :joi.string().required(),
  dest:joi.string(),
})
}

export const validation = (schema) => {
  return (req, res, next) => {
    const validationArry = [];
    dataMethods.forEach((key) => {
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult?.error?.details) {
          validationArry.push(validationResult.error.details);
        }
      }
    });


    if (validationArry.length > 0) {
        return res.status(404).json({message :"validation error From server",
         err:validationArry });
      }else{
        return next();
      }
  };


};
