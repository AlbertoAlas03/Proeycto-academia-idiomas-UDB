const { Router } = require('express')
const router = Router();
const dataController = require('../controllers/dataController')
const { logout, validateToken } = require('../utils/middleWareAuthentication')

//test route
router.get('/api/test', (req, res) => {
    const data = {
        "id": 1,
        "name": "API is working"
    }
    res.json(data)
})

//routes for users
router.get('/api/listuser', validateToken, dataController.listUsers)

router.post('/api/createuser', validateToken, dataController.createUser)

router.put('/api/updateuser/:id', validateToken, dataController.updateUser)

router.delete('/api/deleteuser/:id', validateToken, dataController.deleteUser)

//routes for login

router.post('/api/login', dataController.loginUser)

router.post('/api/logout', validateToken, logout)

module.exports = router;