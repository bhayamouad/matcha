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

}