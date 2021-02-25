const db = require('../setup/db_connection')

module.exports = class Match {

  static add(firstLiker, secondLiker) {
    return db.execute("INSERT INTO matches (first_profile , second_profile) VALUES (?,?)", [firstLiker, secondLiker])
  }
  static delete(firstLiker, secondLiker){
      return db.execute(`DELETE FROM matches WHERE (first_profile = ${firstLiker} AND second_profile = ${secondLiker}) OR (first_profile = ${secondLiker} AND second_profile = ${firstLiker})`)
  }
  static getMatchesByUserId(id){
    return db.execute("SELECT * FROM matches WHERE first_profile = ? OR second_profile = ?",[id])
  }

  static getMatchesByUsers(first, second){
    return db.execute(`SELECT * FROM matches WHERE (first_profile = ${first} AND second_profile = ${second}) OR (first_profile = ${second} AND second_profile = ${first})`)
  }

  
}