const express = require('express');
const app = express();
const http=require('http')
const server=http.createServer(app)
const socketio = require("socket.io");
const io = socketio(server)


const sequelize = require('./util/database');
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')
const fileUpload = require('express-fileupload');


const pageNotFoundMiddleware = require('./middleware/404')

const User = require('./models/user')
const ForgotPasswordRequest = require('./models/forgotPasswordRequest')
const ChatGroup = require('./models/chatGroup')
const Message = require('./models/message')
const User_ChatGroup = require('./models/user_chatGroup')


const userRoutes = require('./routes/user')
const chatRoutes = require('./routes/chat')

app.use(fileUpload())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))


io.on('connection', (socket) => {
    console.log('a user connected to socket');
    socket.on('sendMessage',()=>{
        console.log('sendMessage event is fired from client')
       io.sockets.emit('receiveMessage')
    })
  });


app.use(userRoutes)
app.use(chatRoutes)

app.use(pageNotFoundMiddleware)

//table relationships
User.hasMany(ForgotPasswordRequest)
ForgotPasswordRequest.belongsTo(User)

User.belongsToMany(ChatGroup, { through: User_ChatGroup })
ChatGroup.belongsToMany(User, { through: User_ChatGroup })

ChatGroup.hasMany(Message)
Message.belongsTo(ChatGroup)


sequelize.sync({force:true})
    .then(() => {
        server.listen(3000, () => {
            console.log('Listening on PORT 3000')
        })

    }).catch((error) => {
        console.log(error)
    })

