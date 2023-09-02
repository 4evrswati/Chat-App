const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    chatName: {
        type: String,
        trim: true
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [{
        type: mongoose.ObjectId,
        ref: "User"
    }],
    latestMessage: {
        type: mongoose.ObjectId,
        ref: "Message"
    },
    groupAdmin: {
        type: mongoose.ObjectId,
        ref: "User"
    }
},{timestamps: true});

const Chat = mongoose.model('Chat', chatSchema)

module.exports = Chat;