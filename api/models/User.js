const db = require('../setup/db_connection')

module.exports = class User {
  constructor(user) {
    this.fname = user.fname
    this.lname = user.lname
    this.email = user.email
    this.login = user.login
    this.password = user.password
    this.token = user.token
  }

  create() {
    return db.query('INSERT INTO users SET ?', this)
  }

  static updateStatus(id) {
    return db.execute('UPDATE users SET status = 1, expire_token = NULL WHERE id_user = ?', [id])
  }

  static getByToken(token) {
    return db.execute('SELECT * FROM users WHERE token = ?', [token])
  }


  static getByLogin(login) {
    return db.execute('SELECT * FROM users WHERE email = ? OR login = ? ', [login, login])
  }

  static getById(id) {
    return db.execute('SELECT * FROM users WHERE id_user = ? ', [id])
  }

  static updateToken(token, id) {
    return db.execute('UPDATE users SET token = ?, expire_token = NOW() WHERE id_user = ?', [token, id])
  }

  static ifUnique(email, login) {
    const ret1 = db.execute('SELECT id_user FROM users WHERE email = ?', [email])
    const ret2 = db.execute('SELECT id_user FROM users WHERE login = ?', [login])

    return Promise.all([ret1, ret2])
  }
  static setPassword(password, id) {
    return db.execute('UPDATE users SET password = ?, token = NULL WHERE id_user = ?', [password, id])
  }
}