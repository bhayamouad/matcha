const db = require('./db_connection')

const  User = function (user) {
    this.fname = user.fname
    this.lname = user.lname
    this.email = user.email
    this.login = user.login
    this.password = user.password
    this.token = user.token
}

User.create = (user, result) => {
    db((err,conn) => {
        if(err) throw err

        conn.query(`INSERT INTO users  SET ?`, user, (queryErr, row) => {  
            if (queryErr) throw queryErr
            result(null, { id_user: row.intertId, ...user })
        })
    })
}

User.verify = (token, result) => {
    db((err,conn) =>{
        if (err) throw err
        conn.query(`UPDATE users SET status = 1 WHERE token = ?`, token, (queryErr, row) => {
            if (queryErr) throw queryErr
            result(null, {row})
        })
    })
}

module.exports = User;