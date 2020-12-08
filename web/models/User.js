const db = require('./db_connection')

module.exports = class  User {
  constructor(user) {
    this.fname = user.fname
    this.lname = user.lname
    this.email = user.email
    this.login = user.login
    this.password = user.password
    this.token = user.token
}

static create (user) {
    return db.query(
        'INSERT INTO users  (fname, lname, email, login, password, token) VALUES (?,?,?,?,?,?)',
        [user.fname, user.lname, user.email, user.login, user.password, user.token]
      )
}

static verify (token) {
        return db.execute(
            'UPDATE users SET status = 1 WHERE token = ?',
            [token]
          )
    }
}