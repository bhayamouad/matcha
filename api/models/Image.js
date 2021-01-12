const db = require('../setup/db_connection')

module.exports = class Image {
  constructor(image,) {
    this.path = image.path
    this.user_id = image.user_id
    this.is_profile = image.is_profile
}

  save () {
    return db.query("INSERT INTO images SET ?", this)
  }
  static updateImage(image) {
    return db.execute("UPDATE images SET path = ?, is_profile = ? WHERE user_id = ?", [image.path, image.is_profile, image.user_id])
  }
}