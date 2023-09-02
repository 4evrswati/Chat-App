const express = require('express')
const { isLogIn } = require('../middleware/authMiddleware')
const { sendMessageController, getAllMessages } = require('../controllers/messageController')
const router = express.Router()

//sending messages
router.post('/', isLogIn, sendMessageController)

//get all messages
router.get('/:chatId', isLogIn, getAllMessages)

module.exports = router