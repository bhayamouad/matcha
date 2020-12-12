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

create () {
    return db.query('INSERT INTO users SET ?', this)
  }

static updateStatusByToken (token) {
    return db.execute('UPDATE users SET status = 1 WHERE token = ?', [token])
  }

static getByToken (token) {
    return db.execute('SELECT * FROM users WHERE token = ?', [token])
  }


static getByLogin (email) {
    return db.execute('SELECT * FROM users WHERE email = ? OR login = ? ', [email, email])
  }
static updateToken(token, email) {
    return db.execute('UPDATE users SET token = ? WHERE email = ?', [token,email])
  }

static ifEmailexits(email, login){
    const ret1 =  db.execute('SELECT id_user FROM users WHERE email = ?', [email])
    const ret2 =  db.execute('SELECT id_user FROM users WHERE login = ?', [login])

    return Promise.all([ret1, ret2])
}

}