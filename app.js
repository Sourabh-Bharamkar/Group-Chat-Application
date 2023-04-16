const express = require('express');
const app = express();

const sequelize = require('./util/database');
const bodyParser=require('body-parser')
const path=require('path')
const cors=require('cors')

const pageNotFoundMiddleware=require('./middleware/404')
const userRoutes=require('./routes/user')

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))

app.use(userRoutes)

app.use(pageNotFoundMiddleware)
sequelize.sync()
    .then(() => {
        app.listen(3000)
        console.log('Listening on PORT 3000')
    }).catch((error) => {
        console.log(error)
    })

