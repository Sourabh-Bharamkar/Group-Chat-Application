const path = require('path')
const User = require('../models/user')
const ForgotPasswordRequest=require('../models/forgotPasswordRequest')
const bcrypt = require('bcrypt')
const { error } = require('console')
const Sib=require('sib-api-v3-sdk')
const jwt=require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')


exports.getHomePage = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views/index.html'))
}


exports.postVerifySignupDetails = async (req, res, next) => {

    try {
        console.log('inside postVerifySignupDetails controller')
        const { name, email, mobileNumber, password } = req.body;
        const usersWithSameEmail = await User.findAll({ where: { email: email } })
        const usersWithSameMobileNumber = await User.findAll({ where: { mobileNumber: mobileNumber } })

        if (usersWithSameEmail.length) {
            return res.status(200).json({ success: true, message: 'user already exists with same email' })
        }

        if (usersWithSameMobileNumber.length) {
            return res.status(200).json({ success: true, message: 'user already exists with same mobile number' })
        }

        res.status(200).json({ success: true, message: 'user not found' })


    } catch (error) {

        console.log(error)
        res.status(500).json({ success: false, error: error, message: 'failed to verify signup details' })
    }

}

exports.postSignupUser = async (req, res, next) => {
    try {
        console.log('inside postSignupUser controller')
        const { name, email, mobileNumber, password } = req.body;

        const saltRounds = 10;
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            const user = await User.create({
                name: name,
                email: email,
                mobileNumber: mobileNumber,
                password: hash
            })

            res.status(201).json({ success: true, message: 'Account created successfully' })
        })

    } catch (error) {
        res.status(500).json({ success: false, error: error, message: 'failed to create an account' })
    }
}


function generateAccessToken(id, name) {
    return jwt.sign({ userId: id, name: name }, 'Sourabh@8989')
}


exports.postVerifyLoginDetails = async (req, res, next) => {

    try {
        console.log('inside postVerifyLoginDetails controller')
        const { email, password } = req.body;
        const users = await User.findAll({ where: { email: email } })

        if (users.length == 0) {
            return res.json({ message: 'user not found' })
        }
        const user = users[0];

        bcrypt.compare(password, user.password, (err, match) => {
            console.log(match)
            if (!match) {
                res.status(400).json({ message: 'password is incorrect' })
            }
            else {
                return res.status(200).json({ message: 'login successful', token: generateAccessToken(user.id, user.name) })
            }

        })

    } catch (error) {

        console.log(error)

    }

}


exports.postForgotPassword = async (req, res, next) => {

    try {

        const user = await User.findOne({ where: { email: req.body.email } })
        //create request details in ForgotPasswordRequest table

        const requestDetails = await ForgotPasswordRequest.create({
            id: uuidv4(),
            isActive: 1,
            userId: user.id
        })

        const userEmail = req.body.email;
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;

        const transacEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            email: 'bharamkarsourabh8989@gmail.com'
        };
        const reciever = [{
            email: `${userEmail}`
        }]

        const response = await transacEmailApi.sendTransacEmail({
            sender: sender,
            subject: 'Group Chat App password recover',
            to: reciever,
            textContent: `http://localhost:3000/user/password/reset-password?forgotPasswordRequestId=${requestDetails.id}`

        })


        res.status(200).json({ message: 'message send successfully' })

    } catch (error) {
        console.log(error)
    }

}


exports.getResetPasswordPage = async (req, res, next) => {

    try {
        console.log('inside getResetPasswordPage controller')
        const forgotPasswordRequestId = req.query.forgotPasswordRequestId;
        //check whether forgotPasswordRequestId is valid or not 

        const requestDetails = await ForgotPasswordRequest.findOne({ where: { id: forgotPasswordRequestId } })

        console.log(requestDetails)
        if (!requestDetails) {
            
            res.status(400).json({ message: 'bad request' })
        }
        if (requestDetails.isActive == true) {
            console.log('hi Sourabh ')
            res.status(200).sendFile(path.join(__dirname, '../', 'views/reset-password.html'))
        }

        else {
            res.status(419).json({ message: 'link is expired' })
        }


    } catch (error) {
        console.log(error)
    }

}


exports.postResetPassword = async (req, res, next) => {
    try {
        const password = req.body.password;
        const forgotPasswordRequestId = req.body.forgotPasswordRequestId;

        // find corresponding request details to this forgotPasswordRequestId
        const requestDetails = await ForgotPasswordRequest.findOne({ where: { id: forgotPasswordRequestId } })

        //make the corresponding request as inactive
        await ForgotPasswordRequest.update({ isActive: false }, { where: { id: forgotPasswordRequestId } })

        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            const user = await User.update({
                password: hash
            }, { where: { id: requestDetails.userId } })


            res.status(201).json({ message: 'password reset successfully' })
        })
    } catch (error) {
        console.log(error)
    }
}




