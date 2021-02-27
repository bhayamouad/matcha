require('dotenv').config()
const express = require('express')
const fs = require('fs')
const https = require('https');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors =require('cors')
const red = require("redis")
const redis = red.createClient()


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




io.on('connection', function(socket){
  // console.log(`${socket.id} connected`);                  

  let usr;
  socket.on("connectUser", (user) =>{
    usr = user
    redis.set(user, socket.id)
    // console.log(`${socket.id} connected`) 
  })

  socket.on("isConnected", (user) =>{ 

    // console.log(`${socket.id} emmeted`)                  
    redis.get(user, (err, data) =>{
      // console.log(data)
      if(data)
        socket.emit('returnStatus', true)
      else
        socket.emit('returnStatus', false)
    })
    // return if this user is conected or not            
  })
  
  socket.on('disconnect', function () {     

    redis.del(usr)
    // console.log(usr)     
    // console.log(`disconnected`);     
  }); 
});


server.listen(3000)