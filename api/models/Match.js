const db = require('../setup/db_connection')

module.exports = class Match {

  static add(firstLiker, secondLiker) {
    return db.execute("INSERT INTO matches (first_profile , second_profile) VALUES (?,?)", [firstLiker, secondLiker])
  }
  static delete(firstLiker, secondLiker){
      return db.execute("DELETE FROM matches WHERE first_profile = ? AND second_profile = ?",[firstLiker, secondLiker])
  }
  static getMatchesByUserId(id){
    return db.execute("SELECT * FROM matches WHERE first_profile = ? OR second_profile = ?",[id])
  }
}