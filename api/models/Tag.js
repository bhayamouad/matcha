const db = require('../setup/db_connection')

module.exports = class Tag {

static save (tag) {
    return db.execute("INSERT IGNORE INTO tags (tag) VALUES (?)", [tag])
}

static getAll () {
    return db.execute('SELECT tag FROM tags')
}

}