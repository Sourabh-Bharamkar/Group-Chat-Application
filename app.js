const express = require('express');
const app = express();

const sequelize = require('./util/database');
const bodyParser=require('body-parser')
const path=require('path')
const cors=require('cors')

const pageNotFoundMiddleware=require('./middleware/404')

const User=require('./models/user')
const ChatGroup=require('./models/chatGroup')
const ForgotPasswordRequest=require('./models/forgotPasswordRequest')
const Message=require('./models/message')

const userRoutes=require('./routes/user')
const chatRoutes=require('./routes/chat')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))

app.use(userRoutes)
app.use(chatRoutes)

app.use(pageNotFoundMiddleware)

//table relationships
User.hasMany(ForgotPasswordRequest)
ForgotPasswordRequest.belongsTo(User)

User.belongsToMany(ChatGroup,{through:'User_ChatGroup'})
ChatGroup.belongsToMany(User,{through:'User_ChatGroup'})

ChatGroup.hasMany(Message)
Message.belongsTo(ChatGroup)


sequelize.sync()
    .then(() => {
        app.listen(3000)
        console.log('Listening on PORT 3000')
    }).catch((error) => {
        console.log(error)
    })

