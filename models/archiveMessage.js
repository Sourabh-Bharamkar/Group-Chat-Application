const sequelize=require('../util/database')
const Sequelize=require('sequelize')

const ArchiveMessage=sequelize.define('archiveMessage',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        
    },
    type:{
        type:Sequelize.STRING
    },
    text: {
        type: Sequelize.TEXT
    },
    fileURL: {
        type: Sequelize.TEXT
    },
    sender: {
        type: Sequelize.BIGINT
    }
})

module.exports=ArchiveMessage;