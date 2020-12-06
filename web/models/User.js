const mysql = require('./db_connection')

const  User = function (user) {
    this.fname = user.fname
    this.lname = user.lname
    this.email = user.email
    this.login = user.login
    this.password = user.password
    this.token = user.token
}

User.create = (user, result) => {
    //res.send({message:`hello ${req.body.login} your account was created try to login with this ${req.body.email}:${req.body.password}`})
    mysql.mysql_pool.getConnection(function (err, connection) {
        connection.query(`INSERT INTO users  SET ?`, user, (err, res) => {
            if (err) {
                console.log('error: ', err)
                result(err, null)
                return
            }
            result(null, { id_user: res.insertId, ...user })
        })
    });
}
module.exports = User;