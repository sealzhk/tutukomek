const mongoose = require('mongoose')

const Schema = mongoose.Schema
const userSchema = new Schema({
    email: String,
    password: String,
    firstname: String,
    lastname: String,
    city: String,
    address: String
})
module.exports = mongoose.model('user', userSchema, 'users')