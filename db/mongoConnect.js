require('dotenv').config()

const mongoose = require('mongoose')

async function mongooseConnect() {
    try {
        await mongoose.connect(process.env.DB_CONNECTION);
        console.log('Connected to MongoDB!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

module.exports = mongooseConnect;