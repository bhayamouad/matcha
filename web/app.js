const express = require('express')
const bodyParser = require('body-parser')
const cors =require('cors')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(cors())

app.get('/',(req,res) => {
    res.send({message:"hello world"});
})
const usersRouter = require('./routes/users')
app.use('/account',usersRouter)

app.listen(3000);