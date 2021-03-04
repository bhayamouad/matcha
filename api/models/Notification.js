const db = require('../setup/db_connection')

module.exports = class Notification {
  static push(type, from, to) {
    if(type === 'visit'){
      return db.execute(`SELECT TIMESTAMPDIFF(MINUTE,created_at, CURRENT_TIME()) AS diff FROM notifications WHERE type = ? AND \`from\` = ? AND \`to\` = ? ORDER BY created_at DESC LIMIT 1`,[type, from, to])
        .then(([[ret]]) =>{
          if(!ret || ret.diff >= 1)
            return db.execute("INSERT INTO notifications (type, `from`, `to`) VALUES (?,?,?)", [type, from, to])
        })
    }
    else
      return db.execute("INSERT INTO notifications (type, `from`, `to`) VALUES (?,?,?)", [type, from, to])

  }
  static getAllByUser(id,start,limit){
    return db.execute(`SELECT id_notification, type, \`to\`, ut.login AS \`login_to\` ,uf.login AS \`login_from\`, n.created_at  FROM notifications n 
                        INNER JOIN users uf ON n.from = uf.id_user
                        INNER JOIN users ut ON n.to = ut.id_user
                      WHERE \`to\` = ? ORDER BY n.created_at DESC LIMIT  ${start},${limit}`,[id])
  }

  static getCountNewNotification(id){
    return db.execute("SELECT COUNT(id_notification) as number FROM notifications WHERE `to` = ? AND status = 0",[id])
  }
  static setStatus(id, start, limit){
    return db.execute(`UPDATE notifications n1 INNER JOIN (SELECT id_notification FROM notifications WHERE \`to\` = ? ORDER BY created_at DESC LIMIT  ${start},${limit} ) AS n2 ON n1.id_notification = n2.id_notification SET status = 1`,[id])
  }
}