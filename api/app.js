require('dotenv').config()
const express = require('express')
const fs = require('fs')
const https = require('https');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors =require('cors')
const red = require("redis")
// const redis = red.createClient(6379, process.env.HOST)
const redis = red.createClient(6379, '172.24.0.2')


redis.on("error", function(error) {
  console.error(error);
});

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
const matchaRouter = require('./routes/matchaRouter')

app.use('/account', usersRouter)
app.use('/matcha', matchaRouter)


const server = https.createServer({
  key: fs.readFileSync('/etc/ssl/private/matchasigned.key'),
  cert: fs.readFileSync('/etc/ssl/certs/matchasigned.crt')
}, app)
  
const io = require('socket.io')(server, { 
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

const User = require('./models/User')
io.on('connection', function(socket){
  let usr;
  socket.on("connectUser", (user) =>{
    usr = user
    redis.set(user, socket.id)
    socket.broadcast.emit(usr, true);
  })
  socket.on("isConnected", (user) =>{ 

    redis.get(user, (err, data) =>{
      if(data)
        socket.emit(user, true)
      else
        socket.emit(user, false)
    })
  })
  socket.on("like", (data) => {
    redis.get(data.liked, (err, res) =>{
      if(res){
        socket.broadcast.emit("like"+data.liked, {liker:data.liker, status: true})
      }
      else{
        socket.emit("like"+data.liked, {status: false})
      }
    })
  })

  socket.on("dislike", (data) => {
    redis.get(data.unliked, (err, res) =>{
      if(res){
        socket.broadcast.emit("dislike"+data.unliked, {liker:data.unliker, status: true})
      }
      else{
        socket.emit("dislike"+data.unliked, {status: false})
      }
    })
  })

  socket.on("match1", (data) => {
    redis.get(data.liked, (err, res) =>{
      if(res){
        socket.broadcast.emit("match1"+data.liked, {liker:data.liker, status: true})
      }
      else{
        socket.emit("match1"+data.liked, {status: false})
      }
    })
  })
  socket.on("match2", (data) => {
        socket.emit("match2"+data.liker, {liked:data.liked, status: true})
  })

  socket.on("visit", (data) => {
    redis.get(data.visited, (err, res) => {
      if(res){
        socket.broadcast.emit("visit"+data.visited, {visitor: data.visitor, status: true})
      }
      else
        socket.emit("visit"+data.visited, {status: false})
    })
  })

  socket.on('disconnect', function () {     
    if(usr)
    {
      User.UpdateLastConnection(usr)
      socket.broadcast.emit(usr, false);
      redis.del(usr)
    }
  }); 
});


server.listen(3000)