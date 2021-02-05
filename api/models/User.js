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
  
  static createOauth(user)
  {
    return db.query('INSERT INTO users SET ?', user)
  }

  static getByOauthId(id){
    return db.execute('SELECT * FROM users WHERE oauth_id = ? ', [id])
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

  static checkIfExist(id, email, login){
    const ret1 = db.execute('SELECT id_user FROM users WHERE email = ? AND id_user <> ?', [email, id])
    const ret2 = db.execute('SELECT id_user FROM users WHERE login = ? AND id_user <> ?', [login, id])

    return Promise.all([ret1, ret2])
  }

  static setPassword(password, id) {
    return db.execute('UPDATE users SET password = ?, token = NULL, expire_token = NULL WHERE id_user = ?', [password, id])
  }
  static setProfile(data, id) {
    return db.execute(`UPDATE users SET 
                                      fname = ?, 
                                      lname = ?, 
                                      email = ?, 
                                      login = ?, 
                                      gender = ?, 
                                      birthdate = ?, 
                                      interest = ?, 
                                      biography = ? 
                                    WHERE id_user = ?`, [data.fname, data.lname, data.email, data.login, data.gender,data.birthdate, data.interest, data.bio, id])
  }
  static getStatusById(id){
    return db.execute('SELECT status FROM users WHERE id_user = ?', [id])
  }
  static setStatusById(id){
    return db.execute('UPDATE users SET status = 2 WHERE id_user = ?', [id])
  }

  static getUserPosById(id){
    return db.execute(`SELECT u.*, p.* FROM users u INNER JOIN positions p ON p.user_id = u.id_user WHERE u.id_user = ?`,[id])
  }

  static getUsersPosImg(id){

    return this.getUserPosById(id)
          .then(([[user]]) => 
          {
            let whereGender = null
            if(user.interest === 'B') 
             whereGender = `(u.gender = 'F' OR u.gender = 'M')`
            else
              whereGender = `u.gender = '${user.interest}'`
            return db.execute(`SELECT DISTINCT(u.id_user), u.login, u.rating, TIMESTAMPDIFF(YEAR, u.birthdate, CURDATE()) AS age, (SELECT GROUP_CONCAT(path ORDER BY is_profile ASC SEPARATOR ',') FROM images where user_id = u.id_user) as images, ST_Distance_Sphere(point(${user.lng},${user.lat}), point(p.lng, p.lat))/1000 AS distance,
                                (select count(*) from users_tags ut1 INNER join users_tags ut2 on ut1.tag_id = ut2.tag_id where ut1.user_id = ${user.id_user} and ut2.user_id = u.id_user) AS common_tags
                                  FROM users u
                                  INNER JOIN images i 
                                    ON i.user_id = u.id_user 
                                  INNER JOIN positions p 
                                    ON p.user_id = u.id_user 
                                  WHERE u.id_user <> ? 
                                    AND ${whereGender} 
                                    AND ST_Distance_Sphere(point(${user.lng},${user.lat}), point(p.lng, p.lat))/1000 < 150
                                    AND u.id_user NOT IN (SELECT liked_id FROM likes where liker_id = ${user.id_user} AND liked_id = u.id_user)
                                    AND u.id_user NOT IN (SELECT disliked_id FROM dislikes WHERE disliker_id = ${user.id_user} AND disliked_id = u.id_user)
                                  ORDER BY common_tags DESC, u.rating DESC`,[user.id_user])
          })
          
  }
}