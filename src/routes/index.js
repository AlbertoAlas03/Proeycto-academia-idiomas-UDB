const { Router } = require('express')
const router = Router()
const dataController = require('../controllers/dataController')

//test route
router.get('/api/test', (req, res) => {
    const data = {
        "id": 1,
        "name": "API is working"
    }
    res.json(data)
})

//routes

module.exports = router