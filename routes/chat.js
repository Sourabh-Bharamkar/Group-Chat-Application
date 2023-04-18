const Sequelize=require('sequelize')
const sequelize=require('../util/database')

const express=require('express')
const app=express();
const router=express.Router();
const chatControllers=require('../controllers/chat')

router.get('/dashboard',chatControllers.getDashboard)

module.exports=router;