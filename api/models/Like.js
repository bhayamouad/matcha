const db = require('../setup/db_connection')

module.exports = class Image {

  static add(idLiker, idLiked) {
    return db.execute("INSERT INTO likes (liker_id, liked_id) VALUES (?,?)", [idLiker, idLiked])
  }
  static delete(idLiker, idLiked){
      return db.execute("DELETE FROM likes WHERE liker_id = ? AND liked_id = ?",[idLiker,idLiked])
  }
  static dislike(idDisliker, idDisliked) {
    return db.execute("INSERT INTO dislikes (disliker_id, disliked_id) VALUES (?,?)", [idDisliker, idDisliked])
  }
}