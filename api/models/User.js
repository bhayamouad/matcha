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

  static oauthUpLogin(id)
  {
    return db.execute(`UPDATE users SET login='User${id}' WHERE id_user=${id}`)
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
  static setStatusById(status, id){
    return db.execute('UPDATE users SET status = ? WHERE id_user = ?', [status, id])
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
             whereGender = true
            else
              whereGender = `u.gender = '${user.interest}'`
            return db.execute(`SELECT DISTINCT(u.id_user), u.fname, u.lname, u.login, u.rating, p.city, p.lat, p.lng, TIMESTAMPDIFF(YEAR, u.birthdate, CURDATE()) AS age, (SELECT GROUP_CONCAT(path ORDER BY is_profile ASC SEPARATOR ',') FROM images where user_id = u.id_user) as images, ST_Distance_Sphere(point(${user.lng},${user.lat}), point(p.lng, p.lat))/1000 AS distance,
                                (select count(*) from users_tags ut1 INNER join users_tags ut2 on ut1.tag_id = ut2.tag_id where ut1.user_id = ${user.id_user} and ut2.user_id = u.id_user) AS common_tags
                                  FROM users u
                                  INNER JOIN images i 
                                    ON i.user_id = u.id_user
                                  INNER JOIN positions p 
                                    ON p.user_id = u.id_user 
                                  WHERE u.id_user <> ? 
                                    AND (${whereGender} AND 
                                      CASE u.interest WHEN 'B' 
                                        THEN TRUE
                                        ELSE u.interest = '${user.gender}' END )
                                    AND ST_Distance_Sphere(point(${user.lng},${user.lat}), point(p.lng, p.lat))/1000 < 50
                                    AND u.id_user NOT IN (SELECT liked_id FROM likes where liker_id = ${user.id_user} AND liked_id = u.id_user)
                                    AND u.id_user NOT IN (SELECT disliked_id FROM dislikes WHERE disliker_id = ${user.id_user} AND disliked_id = u.id_user)
                                    AND u.id_user NOT IN (SELECT blocked_id FROM blocks WHERE blocker_id = ${id} AND blocked_id = u.id_user)
                                  ORDER BY common_tags DESC, u.rating DESC`,[user.id_user])
          })
        }
  static getUserPosImgSearch(id, search){
    return this.getUserPosById(id)
      .then(([[user]]) => {
        let whereTags = true
        let whereGender = null
        let whereDistance = true
        let whereAge = null
        if(user.interest === 'B') whereGender = true
        else whereGender = `u.gender = '${user.interest}'`
        if(search.tags.length){
          whereTags = "("
          search.tags.forEach((tag,index) => {
              whereTags += `${(index !== 0)? " OR " :""} tag = "${tag}"` 
          });
          whereTags += ")"
        }
        if(search.distance !== 200)
          whereDistance = `(ST_Distance_Sphere(point(${user.lng},${user.lat}), point(p.lng, p.lat))/1000) <= ${search.distance}`
        if(search.ageGap[1]===50)
          whereAge = `TIMESTAMPDIFF(YEAR, u.birthdate, CURDATE()) >= ${search.ageGap[0]}`
        else
          whereAge = `TIMESTAMPDIFF(YEAR, u.birthdate, CURDATE()) BETWEEN ${search.ageGap[0]} AND ${search.ageGap[1]}`
        return db.execute(`SELECT DISTINCT(u.id_user), u.fname, u.lname, u.login, u.rating, p.city, p.lat, p.lng, TIMESTAMPDIFF(YEAR, u.birthdate, CURDATE()) AS age,
                            (SELECT GROUP_CONCAT(path ORDER BY is_profile ASC SEPARATOR ',') FROM images where user_id = u.id_user) as images, 
                            (SELECT GROUP_CONCAT(tag ORDER BY tag ASC SEPARATOR ',') FROM tags JOIN users_tags ON tags.id_tag = users_tags.tag_id WHERE users_tags.user_id = u.id_user AND ${whereTags}) AS tags,
                            ST_Distance_Sphere(point(${user.lng},${user.lat}), point(p.lng, p.lat))/1000 AS distance,
                            (select count(*) from users_tags ut1 INNER join users_tags ut2 on ut1.tag_id = ut2.tag_id where ut1.user_id = ${id} and ut2.user_id = u.id_user) AS common_tags
                              FROM users u
                                INNER JOIN images i 
                                  ON i.user_id = u.id_user 
                                INNER JOIN positions p 
                                  ON p.user_id = u.id_user
                                LEFT JOIN users_tags ut ON u.id_user = ut.user_id
                                JOIN tags t ON ut.tag_id = t.id_tag
                              WHERE u.id_user <> ${id}
                                AND (${whereGender} 
                                      AND CASE u.interest WHEN 'B'
                                        THEN TRUE
                                        ELSE u.interest = '${user.gender}' 
                                        END
                                    )
                                AND ${whereDistance}
                                AND u.id_user NOT IN (SELECT liked_id FROM likes where liker_id = ${id} AND liked_id = u.id_user)
                                AND u.id_user NOT IN (SELECT disliked_id FROM dislikes WHERE disliker_id = ${id} AND disliked_id = u.id_user)
                                AND u.id_user NOT IN (SELECT blocked_id FROM blocks WHERE blocker_id = ${id} AND blocked_id = u.id_user)
                                AND ${whereAge}
                                AND rating BETWEEN ${search.rateGap[0]/5*100} AND ${search.rateGap[1]/5*100} 
                                AND (SELECT GROUP_CONCAT(tag ORDER BY tag ASC SEPARATOR ',') FROM tags JOIN users_tags ON tags.id_tag = users_tags.tag_id WHERE users_tags.user_id = u.id_user AND ${whereTags}) IS NOT NULL
                              ORDER BY common_tags DESC, u.rating DESC
        `)
      })
  }      

  static getUserProfile(usr, isme){
    let searchBy;
    if(isme)
      searchBy = 'id_user';
    else
      searchBy = 'login';

    return db.execute(`SELECT DISTINCT(id_user), fname, lname, login, gender,interest, birthdate, rating, biography, rating ,(SELECT GROUP_CONCAT(path ORDER BY is_profile ASC SEPARATOR ',') FROM images where user_id = id_user) AS images, 
    (SELECT GROUP_CONCAT(tag ORDER BY tag ASC SEPARATOR ',') FROM tags JOIN users_tags ON tags.id_tag = users_tags.tag_id WHERE users_tags.user_id = id_user) AS tags
      FROM users 
      LEFT JOIN users_tags ON users.id_user = users_tags.user_id
            JOIN tags ON users_tags.tag_id = tags.id_tag
            LEFT JOIN images ON users.id_user = images.user_id 
            WHERE ${searchBy} = ?`, [usr]);

  }

  static checkIfBlocked(visitor, visisted)
  {
    return db.execute(`SELECT * FROM blocks WHERE blocker_id = ? AND blocked_id = ? OR blocker_id = ? AND blocked_id = ?;`, [visitor, visisted, visisted, visitor])
  }
  static reportUser(reporter, reported)
  {
    return db.execute(`INSERT INTO reports (reporter_id, reported_id) VALUES ( ? , ? )`,[reporter, reported])
  }
  static blockUser(blocker, blocked)
  {
    return db.execute(`INSERT INTO blocks (blocker_id, blocked_id) VALUES ( ? , ? )`,[blocker, blocked])
  }

  static setFameRating(newFame, id){
    return db.execute(`UPDATE users set rating = ? where id_user = ?`,[newFame, id])
  }
}