const Sequelize=require('sequelize')
const sequelize=require('../util/database');

const User_ChatGroup=sequelize.define('user_chatGroup',{
    admin:{
        type:Sequelize.BOOLEAN
    }
})

module.exports=User_ChatGroup;