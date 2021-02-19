const db = require('../setup/db_connection')

module.exports = class History{
    
    static getHistory(id, fr, num)
    {
        return db.execute(`SELECT id_history, visitor_id, visited_id, login, histories.created_at FROM histories JOIN users ON histories.visited_id=users.id_user WHERE visitor_id = ? ORDER BY histories.created_at DESC LIMIT ${fr},${num}`,[id])
    }
    static insertHistory(visitor, visisted)
    {
        return db.execute(`SELECT TIMESTAMPDIFF(MINUTE,created_at, CURRENT_TIME()) AS diff FROM histories WHERE visitor_id = ? AND visited_id = ? ORDER BY created_at DESC LIMIT 1`,[visitor, visisted])
        .then(([[ret]]) =>{
            if (ret.diff >= 1)
                return db.execute(`INSERT INTO histories (visitor_id, visited_id) VALUES ( ? , ? )`,[visitor, visisted])
        })
    }
}