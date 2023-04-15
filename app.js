const express = require('express');
const app = express();

const sequelize = require('./util/database');
const bodyParser=require('body-parser')
const path=require('path')

const userRoutes=require('./routes/user')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))

app.use(userRoutes)

sequelize.sync()
    .then(() => {
        app.listen(3000)
        console.log('Listening on PORT 3000')
    }).catch((error) => {
        console.log(error)
    })

