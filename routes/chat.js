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

router.post('/chat/group/send-message',userAuthentication.authenticate,chatControllers.postSendMessage)

router.post('/chat/group/messages',userAuthentication.authenticate,chatControllers.postGroupMessages)

router.get('/chat/group/members',userAuthentication.authenticate,chatControllers.getGroupMembers)

router.get('/chat/messages',userAuthentication.authenticate,chatControllers.getMessages)

router.get('/chat/group/is_admin',userAuthentication.authenticate,chatControllers.getIsUserGroupAdmin)

router.post('/chat/group/member/remove',userAuthentication.authenticate,chatControllers.postRemoveGroupMember)

router.post('/chat/group/member/dismiss-as-a-group-admin',userAuthentication.authenticate,chatControllers.postDismissAsGroupAdmin)

router.post('/chat/group/member/make-group-admin',userAuthentication.authenticate,chatControllers.postMakeGroupAdmin)

router.post('/chat/group/leave',userAuthentication.authenticate,chatControllers.postLeaveGroup)

router.post('/chat/group/upload-file',userAuthentication.authenticate,chatControllers.postUploadFile)
module.exports=router;