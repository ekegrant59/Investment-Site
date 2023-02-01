const mongoose = require('mongoose')
const mongodb = process.env.MONGODB
mongoose.connect(mongodb)

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    password1: String,
    country: String,
    number: String,
    referrer: String,
    date: String,
    bitcoin: String
})

module.exports = mongoose.model('user', userSchema)