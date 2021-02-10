const db = require('../setup/db_connection')

module.exports = class Position {
  constructor(position) {
    this.city = position.city
    this.lat = position.lat
    this.lng = position.lng
    this.user_id = position.user_id 
}

  save () {
    return db.query(`INSERT INTO positions SET ? 
                      ON DUPLICATE KEY UPDATE 
                      city = ?, lat = ?, lng = ?, user_id = ?`, [this,this.city,this.lat,this.lng,this.user_id])  
  }
  static update(lat,lng, id) {
    return db.execute("UPDATE positions SET lat = ?, lng = ? WHERE user_id = ?", [lat, lng, id])
  }

  static getByIdUser(id){
    return db.execute(`SELECT * FROM positions WHERE user_id = ?`,[id])
  }
}