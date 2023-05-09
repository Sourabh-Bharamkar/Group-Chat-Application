const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Message = sequelize.define('message', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
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

module.exports = Message;