const db = require('../setup/db_connection')

module.exports = class Image { 
  constructor(image) { 
    this.path = image.path
    this.user_id = image.user_id
    this.is_profile = image.is_profile
}

  save () {
    return db.query("INSERT INTO images SET ?", this) 
  }
  static updateImage(pos, path) {
    return db.execute("UPDATE images SET path = ? WHERE is_profile = ?", [path, pos])
  }

  static deleteUserImages(id,limit){
    return db.execute("DELETE FROM images WHERE user_id = ? ORDER BY id_image DESC LIMIT ?", [id,limit]) 
  }

  static getUserImages(id){
    return db.execute("SELECT * FROM images WHERE user_id = ? ", [id])
  }
}