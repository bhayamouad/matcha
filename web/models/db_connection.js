const mysql = require('mysql2')

const pool = mysql.createPool({
        host: 'db',
        user: 'tirach',
        database: 'matcha_db',
        password: 'rach'
    })
    
module.exports = pool.promise()
