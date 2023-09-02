const express = require('express')
const router = express.Router()
const { isLogIn } = require('../middleware/authMiddleware')
const { getChatsController, createChatController, createGroupChat, renameGroupChat, addInGroup, removeFromGroup } = require('../controllers/chatController')

//create chats
router.post('/', isLogIn, createChatController)

//get chats
router.get('/', isLogIn, getChatsController)

//group-chats
router.post('/group-chat', isLogIn, createGroupChat)

//rename-group chats
router.put('/group-chat-rename', isLogIn, renameGroupChat)

//add-member-groupChat
router.put('/add-in-group', isLogIn, addInGroup)

//remove-member-groupChat
router.put('/remove-from-group', isLogIn, removeFromGroup)

module.exports = router