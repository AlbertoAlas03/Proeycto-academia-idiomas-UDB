const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const options = { discriminatorKey: 'role', timestamps: true };

const UserSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    activity: {
        type: Boolean,
        required: true,
        default: false
    },
    role: {
        type: String,
        required: true
    }
}, options);

module.exports = mongoose.model('User', UserSchema, 'users');