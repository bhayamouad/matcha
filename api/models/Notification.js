const db = require('../setup/db_connection')

module.exports = class Notification {
  static push(type, from, to) {
    return db.execute(`SELECT TIMESTAMPDIFF(MINUTE,created_at, CURRENT_TIME()) AS diff FROM notifications WHERE type = ? AND \`from\` = ? AND \`to\` = ? ORDER BY created_at DESC LIMIT 1`,[type, from, to])
    .then(([[ret]]) =>{
        if(!ret || ret.diff >= 5)
          return db.execute("INSERT INTO notifications (type, `from`, `to`) VALUES (?,?,?)", [type, from, to])
    })
  }
  static getAllByUser(id,start,limit){
    return db.execute(`SELECT id_notification, type, \`from\`, \`to\`, n.created_at ,u.login FROM notifications n INNER JOIN users u ON n.from = u.id_user WHERE \`to\` = ? ORDER BY n.created_at DESC LIMIT  ${start},${limit}`,[id])
  }

  static getCountNewNotification(id){
    return db.execute("SELECT COUNT(id_notification) as number FROM notifications WHERE `to` = ? AND status = 0",[id])
  }
  static setStatus(id, start, limit){
    return db.execute(`UPDATE notifications n1 INNER JOIN (SELECT id_notification FROM notifications WHERE \`to\` = ? ORDER BY created_at DESC LIMIT  ${start},${limit} ) AS n2 ON n1.id_notification = n2.id_notification SET status = 1`,[id])
  }
}