const Sequelize=require('sequelize')
const sequelize=require('../util/database')

const User=sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },

    name:{
        type:Sequelize.STRING
    },

    email:{
        type:Sequelize.STRING,
        unique:true
    },

    mobileNumber:{
        type:Sequelize.BIGINT,
        unique:true
    },

    password:{
        type:Sequelize.STRING
    }

})


module.exports=User;