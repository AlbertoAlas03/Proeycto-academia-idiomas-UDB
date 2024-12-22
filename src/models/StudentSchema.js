const mongoose = require('mongoose')
const user = require('../models/UserSchema')

const StudentSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    courses: {
        type: [String],
        default: []
    }
})

const student = user.discriminator('student', StudentSchema)

module.exports = student