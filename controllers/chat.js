const path = require('path')
const User = require('../models/user')
const ChatGroup = require('../models/chatGroup')
const Message = require('../models/message')
const User_ChatGroup = require('../models/user_chatGroup')
const { Op } = require('sequelize')

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
        const groupDetails = await req.user.createChatGroup({ name: groupName }, { through: { admin: true } })

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

        const response = await member.getChatGroups({ where: { id: groupId } })

        console.log(response)
        if (response.length) {
            console.log('already member of the group')
            return res.status(400).json({ success: false, message: 'already member of the group' })
        }
        else {
            console.log(member.id)
            const groupMember = await chatGroup.addUser(member, { through: { admin: false } })
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
        const messageDetails = await chatGroup.createMessage({ text: message, sender: req.user.mobileNumber })
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
        const lastMessageId = req.body.lastMessageId;
        const messages = await Message.findAll({
            where: {
                [Op.and]: [
                    { chatGroupId: chatGroupId },
                    { id: { [Op.gt]: lastMessageId } }
                ]
            }
        })

        res.status(200).json({ success: true, messages })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: error })
    }
}


exports.getMessages = async (req, res, next) => {
    try {

        let messageId;
        if (req.query.id == undefined) {
            messageId = 0;

        } else {
            messageId = req.query.id;
        }

        const chatGroups = await req.user.getChatGroups()
        const chatGroupsId = [];
        chatGroups.forEach((chatGroup) => {
            chatGroupsId.push(chatGroup.id)

        })

        const messages = await Message.findAll({
            where: {
                [Op.and]: [{ chatGroupId: chatGroupsId }, { chatGroupId: { [Op.gt]: messageId } }]

            }
        })

        res.status(200).json({ success: true, messages })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: error })
    }

}

exports.getGroupMembers = async (req, res, next) => {
    try {
        const groupId = req.query.groupId;
        const chatGroup = await ChatGroup.findOne({ where: { id: groupId } })
        const groupMembers = await chatGroup.getUsers();
        // console.log('ppppp')
        // console.log(groupMembers[0].user_chatGroup)
        res.status(200).json({ success: true, groupMembers })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: error })
    }
}


exports.getIsUserGroupAdmin = async (req, res, next) => {

    try {

        const groupId = req.query.groupId;
        const user = await User_ChatGroup.findOne({ where: { userId: req.user.id, chatGroupId: groupId } })
        console.log(user.admin)
        res.status(200).json({ success: true, user })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: error })
    }
}


exports.postRemoveGroupMember = async (req, res, next) => {
    try {
        const groupId = req.body.groupId;
        const memberId = req.body.memberId;

        await User_ChatGroup.destroy({ where: { userId: memberId, chatGroupId: groupId } })
        res.status(200).json({ success: true, message: 'removed member from group' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: error })
    }

}


exports.postDismissAsGroupAdmin = async (req, res, next) => {
    try {

        const memberId = req.body.memberId;
        const groupId = req.body.groupId;

        await User_ChatGroup.update({ admin: false }, { where: { userId: memberId, chatGroupId: groupId } })
        res.status(200).json({ success: true, message: 'successfully updated' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: error })
    }
}

exports.postMakeGroupAdmin = async (req, res, next) => {
    try {

        const memberId = req.body.memberId;
        const groupId = req.body.groupId;

        await User_ChatGroup.update({ admin: true }, { where: { userId: memberId, chatGroupId: groupId } })
        res.status(200).json({ success: true, message: 'successfully updated' })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: error })
    }
}

exports.postLeaveGroup = async (req, res, next) => {
    try {

        console.log('entered into postLeaveGroup controller')
        const groupId = req.body.groupId;
        await User_ChatGroup.destroy({ where: { userId: req.user.id, chatGroupId: groupId } })

        //check is there any admin in the group or not
        const groupAdmin = await User_ChatGroup.findOne({ where: { chatGroupId: groupId, admin: true } })

        if (!groupAdmin) {
            const groupMembers = await User_ChatGroup.findAll({ where: { chatGroupId: groupId } })

            if(groupMembers.length==0){
                await ChatGroup.destroy({where:{id:groupId}})
                return res.status(200).json({success:true,message:'user removed from group'})
            }

            const groupMember1 = groupMembers[0]
            await groupMember1.update({ admin: true })
            return res.status(200).json({success:true,message:'user removed from group'})

        }

        res.status(200).json({success:true,message:'user removed from group'})

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, error: error })
    }
}
