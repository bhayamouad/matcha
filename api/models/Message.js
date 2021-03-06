const moment = require('moment')
const db = require('../setup/db_connection')

const User = require('./User')

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
        return db.execute(`SELECT u.id_user, u.login, u.fname, u.lname, i.path, 
                            (SELECT message FROM messages WHERE u.id_user = sender_id OR u.id_user = receiver_id ORDER BY created_at DESC LIMIT 1)as message, 
                            (SELECT sender_id FROM messages WHERE u.id_user = sender_id OR u.id_user = receiver_id ORDER BY created_at DESC LIMIT 1) as sender_id,
                            (CASE WHEN 
                                    (SELECT created_at FROM messages WHERE u.id_user = sender_id OR u.id_user = receiver_id ORDER BY created_at DESC LIMIT 1) IS NULL 
                                THEN m.created_at
                                ELSE (SELECT created_at FROM messages WHERE u.id_user = sender_id OR u.id_user = receiver_id ORDER BY created_at DESC LIMIT 1) END) as sent_at,
                            m.status_first, m.status_second
                            FROM users u
                                INNER JOIN images i ON (i.user_id = u.id_user and i.is_profile = 0)
                                INNER JOIN matches m ON ((u.id_user = m.first_profile AND m.second_profile = ${id}) OR (m.first_profile = ${id} AND u.id_user = m.second_profile))
                            WHERE u.id_user <> ${id}
                                AND ${before}
                                AND u.id_user NOT IN (SELECT blocked_id FROM blocks WHERE blocker_id = ${id} AND blocked_id = u.id_user)
                                AND u.id_user NOT IN (SELECT blocker_id FROM blocks WHERE blocker_id = u.id_user AND blocked_id = ${id})
                            ORDER BY sent_at DESC
                            LIMIT 0,10`, [id])
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
    static setStatus(status, profile1, profile2){
        return db.execute(`SELECT * FROM matches where (first_profile = ${profile1} AND second_profile = ${profile2} ) OR (first_profile = ${profile2} AND second_profile = ${profile1})` )
                    .then( ([[match]]) => {
                        let change
                        if(match.first_profile === profile1)
                            change = "status_first"
                        else
                            change = "status_second"
                        return db.execute(`UPDATE matches SET ${change} = ${status} WHERE (first_profile = ? AND second_profile = ? ) OR first_profile = ? AND second_profile = ?`,[profile1, profile2, profile2, profile1])
                    })
    }
    static ifMatched(from, to)
    {
        return db.execute(`SELECT * FROM matches WHERE ((matches.first_profile = ${from} AND matches.second_profile = ?) OR (matches.first_profile = ? AND matches.second_profile = ${from}))
                            AND ${from}  NOT IN (SELECT blocked_id FROM blocks WHERE blocker_id = ? AND blocked_id = ${from})
                            AND ${from} NOT IN (SELECT blocker_id FROM blocks WHERE blocker_id = ${from} AND blocked_id = ?)`,[to,to,to,to])
    }

    static getCountNewMessages(id){
        return db.execute(`SELECT * FROM matches WHERE (status_first = 0 AND first_profile = ${id}) OR (second_profile = ${id} AND status_second = 0)`)
    }
    static ifSendMessage(login){
        return User.getByLogin(login)
                    .then(([[user]]) => {
                        if(user)
                            return this.getCountNewMessages(user.id_user)
                    })
    }

}