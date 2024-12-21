const DataUsers = require('../models/UserSchema')
const { generateToken } = require('../utils/jwtUtils')
const TokenSchema = require('../models/TokenSchema')

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
    const { user, email, password, rol } = req.body
    const data = new DataUsers({
        user: user || 'No user',
        email: email || 'No email',
        password: password || 'No password',
        rol: rol || 'No rol'
    })
    try {
        const existEmail = await DataUsers.findOne({ email: email })
        if (existEmail !== null) {
            return res.status(400).json({ message: 'Email is already used' })
        }
        await data.save()
        res.json({ message: 'user created', data: data })
    } catch (error) {
        res.status(500).json({ message: 'Error to create new user' })
    }
}

//update user
exports.updateUser = async (req, res, next) => {
    try {
        const data = await DataUsers.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runvalidators: true,
            context: 'query'
        })
        if (!data) {
            return res.status(400).json({ message: 'user not found' })
        }
        res.json({ message: 'user updated', data: data })

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
    const fonduser = await DataUsers.findOne({ user: user, password: password })

    if (fonduser) {
        const tokenPayload = {
            userID: fonduser._id,
            userEmail: fonduser.email,
            useruser: fonduser.user,
        }
        const token = generateToken(tokenPayload)
        const tokenStored = new TokenSchema({
            token: token,
            userId: fonduser._id
        })
        fonduser.activity = true //user is loged
        await fonduser.save()
        await tokenStored.save()
        res.json({ success: true, message: 'user loged', user: fonduser.user, token: token })
    } else {
        res.status(400).json({ message: 'user not found', success: false })
    }
}