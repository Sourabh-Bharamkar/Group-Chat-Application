const express=require('express')
const app=express();

const router=express.Router();

const userControllers=require('../controllers/user')

router.get('/',userControllers.getHomePage)

module.exports=router;
