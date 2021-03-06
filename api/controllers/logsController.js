const History = require('../models/History')
const Notification = require('../models/Notification')
const Message = require('../models/Message')
const User = require('../models/User')

exports.getHistory = (req, res) =>{
    History.getHistory(req.id_user, req.body.from, req.body.num)
    .then(([ret])=>{    
        res.status(200).send({data: ret, error: false});
    })
    .catch(e => res.status(200).send({message: "Something went Wrong! Please try Later", error: true}))
}

exports.getNotifications = async (req, res) => {
    try {
        const [notifications] = await Notification.getAllByUser(req.id_user, req.body.from, req.body.num, req.body.now)
        const [[count]] = await Notification.getCountNewNotification(req.id_user)
        res.status(200).send({notifications, to: (notifications.length > 0) ? notifications[0].login_to : "", new: count.number, error: false})
    } catch (error) {
        res.status(200).send({message: "Something went Wrong! Please try Later", error: true})
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

exports.setMessageStatus = (req, res) => {
    try {
        console.log(req.body.profile);
        User.getByLogin(req.body.profile)
            .then( async ([[user]]) => {
                await Message.setStatus(req.body.status, req.id_user, user.id_user)
                    res.status(200).send({error: false})
            })
            .catch(err => res.status(200).send({message: err.message, error: true}))
    } catch (error) {
        res.status(200).send({message: error.message, error: true})
    }
}