const path = require('path')
const User = require('../models/user')
const ChatGroup = require('../models/chatGroup')
const Message = require('../models/message')

exports.getDashboard = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views/dashboard.html'))
}

exports.getProfile = (req, res, next) => {
    console.log('inside getProfile controller')
    const name = req.user.name;
    const email = req.user.email;
    const mobileNumber = req.user.mobileNumber;

    res.status(200).json({ name, email, mobileNumber })
}


exports.postCreateGroup = async (req, res, next) => {

    try {
        console.log('Inside postCreateGroup controller')
        const user = req.user;
        const groupName = req.body.groupName;
        const groupDetails = await req.user.createChatGroup({ name: groupName }, { createdBy: req.user.mobileNumber })

        res.status(201).json({ success: true, groupDetails: groupDetails, message: 'chat group created successfullly' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: error })
    }

}


exports.getChatGroups = async (req, res, next) => {
    try {
        console.log('Inside getChatGroups controller')
        const user = req.user;
        const chatGroups = await req.user.getChatGroups()

        res.status(200).json({ success: true, chatGroups })

    } catch (error) {
        res.status(500).json({ success: false, error: error })
    }

}



exports.postAddMemberToGroup = async (req, res, next) => {
    try {

        console.log('inside postAddMemberToGroup')
        const { mobileNumber, groupId } = req.body;
        const member = await User.findOne({ where: { mobileNumber: mobileNumber } })
        if (!member) {
            return res.status(400).json({ success: false, message: 'user not found' })
        }
        const chatGroup = await ChatGroup.findOne({ where: { id: groupId } })

        const response = await member.hasChatGroup({where:{id:member.id}})

        if (response) {
            console.log('already member of the group')
            return res.status(400).json({ success: false, message: 'already member of the group' })
        }
        else {
            console.log(member.id)
            const groupMember = await chatGroup.addUser(member)
            return res.status(200).json({ success: true, message: 'member added to group successfully' })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: error })
    }
}


exports.postSendMessage = async (req, res, next) => {

    try {

        console.log('Inside postSendMessage controller')
        const { message, groupId } = req.body;
        const chatGroup = await ChatGroup.findOne({ where: { id: groupId } })
        const messageDetails = await chatGroup.createMessage({ text: message, sender:req.user.mobileNumber })
        console.log(req.user.mobileNumber)
        res.status(201).json({ success: true, message: 'message saved successfully', messageDetails })


    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: error })
    }
}


exports.postGroupMessages = async (req, res, next) => {
    try {

        const chatGroupId = req.body.groupId;
        const messages = await Message.findAll({ where: { chatGroupId: chatGroupId } })
        res.status(200).json({ success: true, messages })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: error })
    }
}