const db = require('../setup/db_connection')

module.exports = class Image {
  constructor(image) { 
    this.path = image.path
    this.user_id = image.user_id
    this.is_profile = image.is_profile
} 

  save (){
    return db.query("INSERT INTO images SET ?", this)
  }
  static updateImage(id, pos, path) {
    return db.execute("UPDATE images SET path = ? WHERE user_id = ? AND is_profile = ?", [path, id, pos])
  }

  static deleteUserImages(id,limit){
    return db.execute(`DELETE FROM images WHERE user_id = ? ORDER BY id_image DESC LIMIT ${limit}`, [id]) 
  }

  static getUserImages(id){
    return db.execute("SELECT * FROM images WHERE user_id = ? ", [id])
  }
  static getUserProfile(id){
    return db.execute("SELECT * FROM images where user_id = ? AND is_profile = 0", [id])
  }
}