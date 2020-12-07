const mysql = require('mysql2')

const pool = mysql.createPool({
        host: 'db',
        user: 'tirach',
        database: 'matcha_db',
        password: 'rach',
        connectionLimit: 10
    })

const dbConnection = function (cb) {
    pool.getConnection((err, connection) => {
        //if(err) throw err;
        //pass the error to the cb instead of throwing it
        if(err) {
          return cb(err);
        }
        cb(null, connection);
    })
}

module.exports = dbConnection
