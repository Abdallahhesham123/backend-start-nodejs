import {Router} from 'express'
import * as userController from  './controller/user.js'
import { AuthUser } from '../../middleware/auth.js';
import { validation } from '../../middleware/validation.js';
import {  updateSchema ,headersSchema, profilePic } from "./crudValidationuser.js";
import { fileupload, fileValidation } from '../../utils/multer.js';
const router = Router();

router.patch("/profilePic",
fileupload('user/profile',fileValidation.image).single("image")
,AuthUser ,validation(profilePic), userController.profilePicUpdated)
router.get("/" , userController.getUser)
router.get("/getProfile" ,  AuthUser,userController.getProfile)

//update with diffrent methode
router.
put("/findByIdAndUpdate"
 ,fileupload('user/profile',fileValidation.image)
 .single("image")
,validation(updateSchema),
 AuthUser,userController.findByIdAndUpdate)

//delete with diffrent methode
router.delete("/findOneAndDelete" ,
 validation(headersSchema),AuthUser,
  userController.findOneAndDelete)
//soft-delete
router.put("/softDelete" , AuthUser,userController.softDelete)
router.put("/restoretodatabase" , AuthUser,userController.restoretodatabase)

export default  router