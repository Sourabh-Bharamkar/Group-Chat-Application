const User = require('../models/user')
const jwt = require('jsonwebtoken')


exports.authenticate = async (req, res, next) => {

    try {
        console.log('entered into authenticate middleware')
        //decrypting the token and passing the corresponding user through the request
        const token = req.headers.authorization;
        console.log(token)
        if (token === undefined) {
            return res.status(401).json({ message: 'you are not currently logged in' })
        }
        const user = jwt.verify(token, 'Sourabh@8989')
        const user1 = await User.findByPk(user.userId)
        if(user1===null){
           return res.status(401).json({ message: 'authentication error' })
        }
        req.user = user1;
        console.log('user authenticated succesfully')
        next();

    } catch (error) {
        console.log(error)
        res.status(401).json({ message: 'authentication error' })
    }

}