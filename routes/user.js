const express=require('express')
const app=express();

const router=express.Router();

const userControllers=require('../controllers/user')

router.get('/',userControllers.getHomePage)

router.post('/user/signup/verify',userControllers.postVerifySignupDetails)

router.post('/user/signup',userControllers.postSignupUser)

module.exports=router;
