require('dotenv').config()
const express = require('express')
const fs = require('fs')
const https = require('https');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors =require('cors')


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('uploads'));
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};
app.use(cors(corsOptions))
app.use(cookieParser())


app.get('/test', (req, res)=> {
  res.send(`The API is running!`)
})
const usersRouter = require('./routes/usersRouter')

app.use('/account',usersRouter)

https.createServer({
    key: fs.readFileSync('/etc/ssl/private/matchasigned.key'),
    cert: fs.readFileSync('/etc/ssl/certs/matchasigned.crt')
  }, app)
  .listen(3000)