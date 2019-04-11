require('dotenv').config()
const express = require('express')
const cors = require ('cors')
const mongoose = require ('mongoose')

const indexRouter = require('./routes/index')
const port = process.env.port || 3000

const app = express()
app.use(cors())
mongoose.connect('mongodb://localhost:27017/classic_fox_live_code_1', {useNewUrlParser: true})

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/', indexRouter)

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

module.exports = app;