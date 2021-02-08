const db = require('../setup/db_connection')

module.exports = class History{
    
    static getHistory(id)
    {
        return db.execute("SELECT id_history, visitor_id, visited_id, login, histories.created_at FROM histories JOIN users ON histories.visited_id=users.id_user WHERE visitor_id = ? ORDER BY histories.created_at DESC",[id])
    }
}