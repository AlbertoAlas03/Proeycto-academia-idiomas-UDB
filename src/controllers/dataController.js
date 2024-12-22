const DataUsers = require('../models/UserSchema')
const { generateToken } = require('../utils/jwtUtils')
const TokenSchema = require('../models/TokenSchema')
const DataTeachers = require('../models/TeacherSchema')
const DataStudents = require('../models/StudentSchema')

//controllers for DataUsers

//list all users
exports.listUsers = async (req, res, next) => {
    try {
        const data = await DataUsers.find({})
        res.json(data)
    } catch (error) {
        console.log(error)
        res.status(200).send(error)
        next()
    }
}

//create new user
exports.createUser = async (req, res, next) => {
    const { user, email, password, role, phoneNumber, address, carnet } = req.body
    let newUser;

    if (role === 'student') {
        newUser = new DataStudents({
            user: user || 'no user',
            email: email || 'no email',
            password: password || 'no password',
            phoneNumber: phoneNumber || 'no phoneNumber',
            address: address || 'no address',
        })
    } else if (role === 'teacher') {
        newUser = new DataTeachers({
            user: user || 'no user',
            email: email || 'no email',
            password: password || 'no password',
            phoneNumber: phoneNumber || 'no phoneNumber',
            address: address || 'no address',
            carnet: carnet || 'no carnet'
        })
    } else {
        newUser = new DataUsers({
            user: user || 'no user',
            email: email || 'no email',
            password: password || 'no password',
            role: role || 'no role'
        })
    }

    try {
        const existEmail = await DataUsers.findOne({ email: email })
        const exitsUser = await DataUsers.findOne({ user: user })
        if (existEmail !== null) {
            return res.status(400).json({ message: 'Email is already used' })
        } else if (exitsUser !== null) {
            return res.status(400).json({ message: 'User name is already used' })
        }
        await newUser.save()
        res.json({ message: 'user created', data: newUser })
    } catch (error) {
        res.status(500).json({ message: 'Error to create new user' })
    }
}

//update user
exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const updates = req.body
        let updateduser

        const user = await DataUsers.findById(id)
        if (!user) {
            return res.status(400).json({ message: 'user not found' })
        }
        switch (user.role) {
            case 'student':
                updateduser = await DataStudents.findByIdAndUpdate(id, updates, {
                    new: true,
                    runvalidators: true,
                    context: 'query'
                })
                break;
            case 'teacher':
                updateduser = await DataTeachers.findByIdAndUpdate(id, updates, {
                    new: true,
                    runvalidators: true,
                    context: 'query'
                })
                break;
            case 'admin':
                updateduser = await DataUsers.findByIdAndUpdate(id, updates, {
                    new: true,
                    runvalidators: true,
                    context: 'query'
                })
                break;
            default:
                return res.status(400).json({ message: 'role doesnt exist' })
        }

        res.json({ message: 'user updated', data: updateduser })

    } catch (error) {
        res.status(500).json({ message: 'Error to update user' })
    }
}

//delete user
exports.deleteUser = async (req, res, next) => {
    try {
        const data = await DataUsers.findByIdAndDelete({ _id: req.params.id }, req.body, {
            new: true,
            runvalidators: true,
            context: 'query'
        })
        if (!data) {
            return res.status(400).json({ message: 'user not found' })
        }
        res.json({ message: 'user deleted', data: data })
    } catch (error) {
        res.status(500).json({ message: 'Error to delete user' })
    }
}

//login user

exports.loginUser = async (req, res, next) => {
    const { user, password } = req.body
    const founduser = await DataUsers.findOne({ user: user, password: password })

    if (founduser) {
        const tokenPayload = {
            userID: founduser._id,
            userEmail: founduser.email,
            useruser: founduser.user,
        }
        const token = generateToken(tokenPayload)
        const tokenStored = new TokenSchema({
            token: token,
            userId: founduser._id
        })
        founduser.activity = true //user is loged
        await founduser.save()
        await tokenStored.save()
        res.json({ success: true, message: 'user loged', user: founduser.user, token: token })
    } else {
        res.status(400).json({ message: 'user not found', success: false })
    }
}