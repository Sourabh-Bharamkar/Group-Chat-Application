const Sequelize=require('sequelize')
const sequelize=require('../util/database')

const Message=sequelize.define('message',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    text:{
        type:Sequelize.TEXT
    },
    sender:{
        type:Sequelize.BIGINT
    }
   
})

module.exports=Message;