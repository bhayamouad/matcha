const express = require('express')
const bodyParser = require('body-parser')
const cors =require('cors')
const cookieParser = require('cookie-parser');

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());

app.use(cors())

const usersRouter = require('./routes/usersRouter')

app.use('/account',usersRouter)

app.listen(3000);