const express = require('express')
const { createUser, loginController, allUsers } = require('../controllers/authController')
const { isLogIn } = require('../middleware/authMiddleware')
const router = express.Router()

//create user
router.post('/register', createUser)

//login user
router.post('/login', loginController)

//get all users
router.get('/', isLogIn, allUsers);

module.exports = router