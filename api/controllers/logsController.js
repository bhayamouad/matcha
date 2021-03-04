const History = require('../models/History')
const Notification = require('../models/Notification')

exports.getHistory = (req, res) =>{
    History.getHistory(req.id_user, req.body.from, req.body.num)
    .then(([ret])=>{    
        res.status(200).send({data: ret, error: false});
    })
    .catch(e => {
        console.log(e.message);
        res.status(200).send({data: e.message, error: true})
    })
}

exports.getNotifications = async (req, res) => {
    try {
        const [notifications] = await Notification.getAllByUser(req.id_user, req.body.from, req.body.num, req.body.time)
        const [[count]] = await Notification.getCountNewNotification(req.id_user)
        res.status(200).send({notifications, to: notifications[0].login_to, new: count.number, error: false})
    } catch (error) {
        res.status(200).send({message: error.message})
    }
}
exports.getNewNotifications = async (req, res) => {
    try {
        const [[count]] = await Notification.getCountNewNotification(req.id_user)
        res.status(200).send({number:count.number, error: false})
    } catch (error) {
        res.status(200).send({message: "Something went Wrong! Please try Later", error: true})
    }
}

exports.setNotifStatus = async (req, res) => {
    try {
        await Notification.setStatus(req.id_user, req.body.from, req.body.num)
        res.status(200).send({message:"done", error: false})
    } catch (error) {
        res.status(200).send({message: "Something went Wrong! Please try Later", error: true})
    }

}