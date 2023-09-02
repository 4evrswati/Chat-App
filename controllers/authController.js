const User = require("../models/userModel");
const jwt = require('jsonwebtoken')
const {hashPassword, comparePassword} = require('../helper/authHelper')

//create User
const createUser = async(req, res) => {

    try {
        const {name, email, password, pic} = req.body;

        if(!name || !email || !password)
        {
            return res.status(403).send({message: 'Please, Provide complete details'})
        }

        const user = await User.findOne({ email })

        if(user) {
            return res.status(403).send({message: 'User already exists'})
        }

        const hashedPassword = await hashPassword(password)

        const newUser = await new User({
            name, email, password: hashedPassword, pic
        }).save()

        const token = jwt.sign({_id: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: "7d"})

        return res.status(200).send({
            success: true,
            message: "User Registered Successfully",
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            pic: newUser.pic,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message: "Error in Registration",
            error
        })
    }
}

//login Controller
const loginController = async(req, res) => {
    try {
        const {email, password} = req.body

        if(!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Provide complete details"
            })
        }

        const user = await User.findOne({email})

        if(!user) {
            return res.status(400).send({
                success: false,
                message: "User doesn't exists"
            })
        }

        const isPasswordValid = await comparePassword(password, user.password)

        if(!isPasswordValid) {
            return res.status(400).send({
                success: false,
                message: "Invalid Password"
            })
        }

        const token = await jwt.sign({_id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn:"7d"})

        return res.status(200).send({
            success: true,
            message: "Login Successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message: "Error in LogIn",
            error
        })
    }
}

//get all users
            //api/user?search=swati
const allUsers = async(req, res) => {
    try {
        const keyword = req.query.search ? {
            $or: [
                {name: {$regex: req.query.search, $options: 'i'}},
                {email: {$regex: req.query.search, $options: 'i'}}
            ]
        } : {};

        const users = await User.find(keyword).find({_id: {$ne:req.user._id}})
        
        res.status(200).send({
            success : true,
            users
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success : false,
            message: "Error in getting users",
            error
        })
    }
}

module.exports = {createUser, loginController, allUsers}