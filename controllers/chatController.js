const Chat = require('../models/chatModel');
const User = require('../models/userModel');

const createChatController = async(req, res) => {
    try {
        const { userId } = req.body;

        if(!userId) {
            console.log('UserId params not sent with request');
            return res.status(400).send({message: "Send user id"})
        }

        var isChatExists = await Chat.find({
            isGroupChat: false,
            $and: [
                {users:{$elemMatch: {$eq: req.user._id}}},
                {users:{$elemMatch: {$eq: userId}}},
            ]
        }).populate("users", "-password").populate("latestMessage")

        isChatExists = await User.populate(isChatExists, {
            path: 'latestMessage.sender',
            select: "name pic email"
        })

        if(isChatExists.length > 0) {
            res.send(isChatExists[0])
        } else {
            var chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: [req.user._id, userId]
            }
        }

        const createdChat = await new Chat(chatData).save()

        const fullChat = await Chat.findOne({_id: createdChat._id}).populate("users", "-password")

        res.status(200).json(fullChat)

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error in creating Chat"
        })
    }
}

const getChatsController = async(req, res) => {
    try {
        Chat.find({
            users:{$elemMatch: {$eq: req.user._id}}
        }).populate("users", "-password")
          .populate("groupAdmin", "-password")
          .populate("latestMessage")
          .sort({updatedAt: -1})
          .then(async(results) => {
            results = await User.populate(results, {
                path: 'latestMessage.sender',
                select: "name pic email"
            })
            res.status(200).send(results)
          })

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error in getting Chat"
        })
    }
}

const createGroupChat = async(req, res) => {
    try {
        if(!req.body.users || !req.body.name) {
            return res.status(400).send({ message: "Please, fill all the fields"})
        }

        var users = JSON.parse(req.body.users);

        if(users.length < 2) {
            return res.status(400).send({message: "More than 2 users are requried to form a group chat"});
        }

        users.push(req.user);

        const groupChat = await new Chat({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        }).save();

        const fullGroupChat = await Chat.findOne({_id: groupChat._id})
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(200).json(fullGroupChat)

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error in creating group Chat"
        })
    }
}

const renameGroupChat = async(req, res) => {
    try {
        const { chatId, chatName } = req.body;

        const updatedChat = await Chat.findByIdAndUpdate(chatId,{
            chatName: chatName
        }, {new: true})
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        if(!updatedChat) {
            return res.status(400).send({message: "Chat Not Found"})
        }

        res.status(200).json(updatedChat)

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error in renaming group Chat"
        })
    }
}

const addInGroup = async(req, res) => {
    try {
        const { chatId, userId } = req.body;

        const addingInGroup = await Chat.findByIdAndUpdate(chatId, {
            $push: {users: userId}
        }, {new: true})
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        if(!addingInGroup) {
            return res.status(400).send({message: "Chat Not Found"})
        }
        else
        {
            res.status(200).json(addingInGroup)
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error in Adding in Group Chat"
        })
    }
}

const removeFromGroup = async(req, res) => {
    try {
        const { chatId, userId } = req.body;

        const removingFromGroup = await Chat.findByIdAndUpdate(chatId, {
            $pull: {users: userId}
        }, {new: true})
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        if(!removingFromGroup) {
            return res.status(400).send({message: "Chat Not Found"})
        }
        else
        {
            res.status(200).json(removingFromGroup)
        }

    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error in Removing from Group Chat"
        })
    }
}

module.exports = {createChatController, getChatsController, createGroupChat, renameGroupChat, addInGroup, removeFromGroup}