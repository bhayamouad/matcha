const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql')
const connection = mysql.createConnection({
  host: 'db',
  user: 'tirach',
  password: 'rach',
  database: 'test'
})

connection.connect()
const app = express();
connection.query('SELECT * FROM hello', function (err, rows, fields) {
  if (err) throw err

  console.log('The solution is: ', rows)
})

connection.end()


app.use(bodyParser.json());
app.get('/',(req,res,next) => {
    res.send("hello worldsssss");
})
app.listen(3000);