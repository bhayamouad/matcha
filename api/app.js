const express = require('express')
const bodyParser = require('body-parser')
const cors =require('cors')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())
app.get('/test', (req, res)=> res.send("The API is running!"))
const usersRouter = require('./routes/usersRouter')

app.use('/account',usersRouter)

app.listen(3000);