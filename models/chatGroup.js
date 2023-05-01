const Sequelize=require('sequelize')
const sequelize=require('../util/database')


const ChatGroup=sequelize.define('chatGroup',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },

    name:{
        type:Sequelize.STRING,
        
    }

})


module.exports=ChatGroup;