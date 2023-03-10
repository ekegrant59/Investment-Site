const mongoose = require('mongoose')
const mongodb = process.env.MONGODB
mongoose.connect(mongodb)

const balanceSchema = new mongoose.Schema({
    name: String,
    email: String,
    balance: Number,
    ROI: Number,
    bonus: Number,
    plan: String
})

module.exports = mongoose.model('balance', balanceSchema)