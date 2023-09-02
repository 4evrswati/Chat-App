const mongoose = require('mongoose')

const dbConnect = () => {
    return (
        mongoose.connect(process.env.MONGO_URL).then((x) => {
            console.log('Database connected successfully');
        }).catch((e) => {
            console.log('Database not connected');
        })
    )
}

module.exports = dbConnect