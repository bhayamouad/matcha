const db = require('../setup/db_connection')

module.exports = class Tag {

static saveTag (tag) {
    return db.execute("INSERT INTO tags (tag) VALUES (?)", [tag])
}

static getTags () {
    return db.execute('SELECT tag FROM tags')
}

}