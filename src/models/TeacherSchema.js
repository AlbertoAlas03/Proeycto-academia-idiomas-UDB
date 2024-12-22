const mongoose = require('mongoose')
const user = require('./UserSchema')

const TeacherSchema = new mongoose.Schema({
    phoneNumber: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    carnet: {
        type: String,
        required: true
    },
    courses: {
        type: [String],
        default: []
    }
})

const Teacher = user.discriminator('teacher', TeacherSchema)

module.exports = Teacher