'use strict'
const express = require('express')
const app = express()
const morgan = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
const { MongoClient } = require("mongodb")

require('dotenv').config()

//settings
const port = process.env.PORT || 3002
app.set('json spaces', 2)

//mongo connection
const uri = process.env.Mongo_uri
mongoose.Promise = global.Promise
mongoose.connect(uri).then(db => console.log('Conexión exitosa')).catch(err => console.log('error: ', err))

const client = new MongoClient(uri)

async function run() {
    try {
        const database = client.db('sample')
        const data = database.collection('data')
    } finally {
        await client.close()
    }
}

run().catch(console.dir);

//middlewares
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

//routes
app.use(require('./routes/index'))

//starting server
app.listen(port, () => {
    console.log('Server listening on port ' + port)
})