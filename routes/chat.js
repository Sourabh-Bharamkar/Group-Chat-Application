const express=require('express')
const app=express();

const router=express.Router();
const chatControllers=require('../controllers/chat')
const userAuthentication=require('../middleware/auth')

router.get('/dashboard',chatControllers.getDashboard)

router.get('/chat/profile',userAuthentication.authenticate, chatControllers.getProfile)

router.post('/chat/create-group',userAuthentication.authenticate,chatControllers.postCreateGroup)

router.get('/chat/groups',userAuthentication.authenticate,chatControllers.getChatGroups)

router.post('/chat/group/add-member',userAuthentication.authenticate,chatControllers.postAddMemberToGroup)

router.post('/chat/send-message',userAuthentication.authenticate,chatControllers.postSendMessage)

router.post('/chat/group/messages',userAuthentication.authenticate,chatControllers.postGroupMessages)

module.exports=router;