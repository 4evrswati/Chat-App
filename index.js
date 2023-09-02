const express = require('express')
const dbConnect = require('./config/dbConnect')
const app = express()
require('dotenv').config()
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const path = require('path')

PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, './client/build')))

dbConnect();

app.use('/api/user', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.get('/', (req, res) => {
    res.send("Hey...")
})

//rest API
app.use('*', function(req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'))
})

const server = app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
})

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on('connection', (socket) => {
    console.log('Connected to socket.io');

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected')
    })

    socket.on('join chat', (room) => {
        socket.join(room)
        console.log('User joined room : ' + room);
    })

    socket.on('typing', (room) => socket.in(room).emit("typing"))
    socket.on('stop typing', (room) => socket.in(room).emit("stop typing"))

    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if(!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user => {
            if(user._id === newMessageReceived.sender._id) return;

            socket.in(user._id).emit('message received', newMessageReceived)
        })
    })

    socket.off('setup', () => {
        console.log('User Disconnected');
        socket.leave(userData._id)
    })
})