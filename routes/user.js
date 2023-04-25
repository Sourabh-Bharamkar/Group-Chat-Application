const express=require('express')
const app=express();

const router=express.Router();
const userControllers=require('../controllers/user')

router.get('/',userControllers.getHomePage)

router.post('/user/signup/verify',userControllers.postVerifySignupDetails)

router.post('/user/signup',userControllers.postSignupUser)

router.post('/user/login/verify',userControllers.postVerifyLoginDetails)

router.post('/user/password/forgot-password',userControllers.postForgotPassword)

router.get('/user/password/reset-password',userControllers.getResetPasswordPage)

router.post('/user/password/reset-password',userControllers.postResetPassword)


module.exports=router;
