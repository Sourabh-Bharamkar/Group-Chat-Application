const path = require('path')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { error } = require('console')

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



