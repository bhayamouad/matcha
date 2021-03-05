const moment = require('moment')
const db = require('../setup/db_connection')

module.exports = class Message {
    static send(sender, receiver, message) {
        return db.execute(`SELECT * FROM matches 
                            WHERE (first_profile = ${sender} AND second_profile = ${receiver}) 
                                OR (first_profile = ${receiver} AND second_profile = ${sender})`)
            .then(([[check]]) => {
                if (check.length === 1)
                    return db.execute(`INSERT INTO messages (message, sender_id, receiver_id) VALUES (?,?,?)`, [message, sender, receiver]);
            })
    }

    static getMatchesByIdUser(id, start, limit, now) {
        let before
        if (!now)
            before = 'TRUE'
        else
            before = `( (CASE WHEN msg.created_at IS NULL THEN m.created_at ELSE msg.created_at END) <= '${moment(now).format('YYYY-MM-DD HH:mm:ss')}')`
        return db.execute(`SELECT u.id_user, u.login, u.fname, u.lname, i.path, msg.message, msg.sender_id, msg.status, 
                                (CASE WHEN msg.created_at IS NULL 
                                    THEN m.created_at
                                    ELSE msg.created_at END) as sent_at 
                            FROM users u
                                INNER JOIN images i ON (i.user_id = u.id_user and i.is_profile = 0)
                                INNER JOIN matches m ON ((u.id_user = m.first_profile AND m.second_profile = ${id}) OR (m.first_profile = ${id} AND u.id_user = m.second_profile))
                                LEFT JOIN (SELECT * FROM messages ORDER BY created_at DESC LIMIT 1) msg  ON ((u.id_user = msg.sender_id AND ${id} = msg.receiver_id) OR (u.id_user = msg.receiver_id AND ${id} = msg.sender_id))
                            WHERE u.id_user <> ?
                                AND ${before}
                                AND u.id_user NOT IN (SELECT blocked_id FROM blocks WHERE blocker_id = ${id} AND blocked_id = u.id_user)
                                AND u.id_user NOT IN (SELECT blocker_id FROM blocks WHERE blocker_id = u.id_user AND blocked_id = ${id})
                            ORDER BY sent_at DESC
                            LIMIT ${start},${limit}`, [id])
    }

    static getChatInfoByLogin(id, usr)
    {
        return db.execute(`SELECT u.id_user,u.login, u.fname,u.lname,i.path from users u
        JOIN images i ON (i.user_id = u.id_user and i.is_profile = 0)
        where u.login = ? 
        AND (u.id_user IN (SELECT first_profile FROM matches WHERE second_profile = ${id}) OR u.id_user IN (SELECT second_profile FROM matches WHERE first_profile = ${id}))
        AND u.id_user NOT IN (SELECT blocked_id FROM blocks WHERE blocker_id = ${id} AND blocked_id = u.id_user)
        AND u.id_user NOT IN (SELECT blocker_id FROM blocks WHERE blocker_id = u.id_user AND blocked_id = ${id})`,[usr])
    }

    static getChatByLogin(id, usr)
    {
        return db.execute(`SELECT m.message,m.created_at,m.sender_id  from users u
        JOIN messages m on (m.sender_id = u.id_user and m.receiver_id = ${id} OR m.receiver_id = u.id_user AND m.sender_id = ${id})
        where u.login = ? 
        AND (u.id_user IN (SELECT first_profile FROM matches WHERE second_profile = ${id}) OR u.id_user IN (SELECT second_profile FROM matches WHERE first_profile = ${id}))
        ORDER BY m.created_at ASC`,[usr])
    }
    static sendMessage(from, to, msg){
        return db.execute(`INSERT INTO messages (message, sender_id, receiver_id) VALUES(?,?,?)`,[msg, from, to])
    }
}