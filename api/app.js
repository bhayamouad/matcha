require('dotenv').config()
const express = require('express')
const fs = require('fs')
const https = require('https');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors =require('cors')
const red = require("redis")
const redis = red.createClient(6379, process.env.HOST)
// const redis = red.createClient(6379, '172.23.0.4')


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

  socket.on("sendMsg", (data) =>{ 

    redis.get(data.to, (err, res) =>{
      if(res){
        socket.broadcast.emit(data.from+"=>"+data.to, data.msg)
        socket.broadcast.emit("msg"+data.to, data)
      }
    })
  })

  socket.on("like", (data) => {
    redis.get(data.liked, (err, res) =>{
      if(res)
        socket.broadcast.emit("like"+data.liked, {liker:data.liker})
    })
  })

  socket.on("dislike", (data) => {
    redis.get(data.unliked, (err, res) =>{
      if(res)
        socket.broadcast.emit("dislike"+data.unliked, {unliker:data.unliker})
    })
  })

  socket.on("match1", (data) => {
    redis.get(data.liked, (err, res) =>{
      if(res)
        socket.broadcast.emit("match1"+data.liked, {liker:data.liker})
    })
  })
  socket.on("match2", (data) => {
        socket.emit("match2"+data.liker, {liked:data.liked})
  })

  socket.on("visit", (data) => {
    redis.get(data.visited, (err, res) => {
      if(res)
        socket.broadcast.emit("visit"+data.visited, {visitor: data.visitor})
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