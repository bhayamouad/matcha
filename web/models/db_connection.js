const mysql = require('mysql2')

exports.mysql_pool = mysql.createPool({
        host: 'db',
        user: 'tirach',
        database: 'matcha_db',
        password: 'rach',
        connectionLimit: 10
    })