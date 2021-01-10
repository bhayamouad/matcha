const db = require('../setup/db_connection')

module.exports = class Position {
  constructor(position) {
    this.city = position.city
    this.lat = position.lat
    this.lng = position.lng
    this.user_id = position.user_id
}

  savePosition () {
    return db.query("INSERT INTO positions SET ?", this)
  }
  static updatePosition(pos) {
    return db.execute("UPDATE positions SET city = ?, lat = ?, lng = ? WHERE user_id = ?", [pos.city, pos.lat, pos.lng, pos.user_id])
  }
}