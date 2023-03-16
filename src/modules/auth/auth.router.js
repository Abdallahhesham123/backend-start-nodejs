import {Router} from 'express'
import * as authController from  './controller/auth.js'
import { LoginSchema, resetPassword, signUpSchema ,userPasswordResetGen} from "./ValidationUser.js";
import { validation } from '../../middleware/validation.js';
import { AuthUser } from '../../middleware/auth.js';
const router = Router();


router.get("/" , authController.getAuthModule)
router.post("/register" ,validation(signUpSchema), authController.register)
router.post("/login" , validation(LoginSchema),authController.login)


router.post("/verify-email/:UserId/:otp" , authController.verifyEmail)
router.get("/verification-email/:token" , authController.verifyRefreshEmail)
router.get("/confirmation-email/:token" , authController.confirmationEmail)

router.put("/resetpassword" , AuthUser,validation(resetPassword),authController.resetpassword)
router.post("/forgetpassword" , authController.sendingemail)
router.post('/reset-password-forgetted/:id/:token',validation(userPasswordResetGen),authController.userPasswordResetGen)
export default  router