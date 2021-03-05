const db = require('../setup/db_connection')

module.exports = class Message {
    static send(sender, receiver, message){
        return db.execute(`SELECT * FROM matches 
                            WHERE (first_profile = ${sender} AND second_profile = ${receiver}) 
                                OR (first_profile = ${receiver} AND second_profile = ${sender})`)
                .then(([[check]]) => {
                    if(check.length === 1)
                        return db.execute(`INSERT INTO messages (message, sender_id, receiver_id) VALUES (?,?,?)`,[message, sender, receiver]);
                })
    }

    static getMatchesByIdUser(id,start,limit){
        return db.execute(`SELECT u.id_user, u.login, u.fname, u.lname, i.path, msg.message, msg.sender_id, msg.status,msg.created_at AS sent_at, m.created_at AS matched_at FROM users u
                            INNER JOIN images i ON (i.user_id = u.id_user and i.is_profile = 0)
                            INNER JOIN matches m ON ((u.id_user = m.first_profile AND m.second_profile = ${id}) OR (m.first_profile = ${id} AND u.id_user = m.second_profile))
                            LEFT JOIN (SELECT * FROM messages ORDER BY created_at DESC LIMIT 1) msg  ON (u.id_user = msg.sender_id OR u.id_user = msg.receiver_id)
                            WHERE u.id_user <> ?
                                AND u.id_user NOT IN (SELECT blocked_id FROM blocks WHERE blocker_id = ${id} AND blocked_id = u.id_user)
                                AND u.id_user NOT IN (SELECT blocker_id FROM blocks WHERE blocker_id = u.id_user AND blocked_id = ${id})
                            ORDER BY sent_at DESC, matched_at DESC
                            LIMIT ${start},${limit}`,[id])
    }
}