const db = require('../setup/db_connection')

module.exports = class Tag {

static save (tag) {
    return db.execute("INSERT INTO tags (tag) VALUES (?)", [tag])
}
static getByTag(tag){
    return db.execute("SELECT * FROM tags WHERE tag = ?",[tag])
}
static getAll () {
    return db.execute('SELECT tag FROM tags ORDER BY tag')
}
static saveUserTag(idUser,idTag){
    return db.execute(`INSERT IGNORE INTO users_tags (tag_id, user_id) values (?,?)`,[idTag, idUser])
}
static getByUser(id){
    return db.execute(`SELECT t.tag FROM users_tags ut INNER JOIN tags t ON t.id_tag = ut.tag_id WHERE user_id = ? ORDER BY t.tag`,[id])
}
static getUserTags(id){
    return db.execute(`SELECT id_tag, tag  FROM users_tags JOIN tags ON users_tags.tag_id = tags.id_tag WHERE user_id = ?`, [id])
}
static deleteTags(id_user, id_tags){
    return db.execute(`DELETE FROM users_tags WHERE user_id = ? AND tag_id IN (${id_tags})`, [id_user])
}
}