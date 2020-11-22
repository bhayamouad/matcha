const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2')
const connection = mysql.createConnection({
  host: 'db',
  user: 'tirach',
  password: 'rach',
  database: 'db_matcha'
})

connection.connect()
const app = express();
con.connect(function(err) {
  if (err) throw err;
  console.log("matcha Connected!");
});

connection.end()


app.use(bodyParser.json());
app.get('/',(req,res,next) => {
    res.send("hello worldsssss");
})
app.listen(3000);