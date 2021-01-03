const db = require('../setup/db_connection')

module.exports = class Tag {
  constructor(tag) {
    this.tag = tag
}

saveTag () {
    return db.execute("INSERT INTO tags (tag) VALUS (?)", this.tag)
}
static saveTagUser(user_id, tag_id){
    return db.execute('INSERT INTO users_tags (user_id, tag_id) VALUES (?,?)', user_id, tag_id)
}

static getTags () {
    return db.execute('SELECT tag FROM tags')
}

static getTagById (id_tag) {
    return db.execute('SELECT * FROM tags WHERE id_tag = ?', id_tag)
}


}