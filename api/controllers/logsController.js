const History = require('../models/History')
const Notification = require('../models/Notification')
const Message = require('../models/Message')
const User = require('../models/User')

exports.getHistory = (req, res) =>{
    History.getHistory(req.id_user, req.body.from, req.body.num)
    .then(([ret])=>{    
        res.status(200).send({data: ret});
    })
    .catch(e => res.status(200).send({error: 'Something went Wrong! Please try Later'}))
}

exports.getNotifications = async (req, res) => {
    try {
        const [notifications] = await Notification.getNotificationsByUser(req.id_user, req.body.from, req.body.num, req.body.now)
        res.status(200).send({notifications, to: (notifications.length > 0) ? notifications[0].login_to : ""})
    } catch (error) {
        res.status(200).send({error: 'Something went Wrong! Please try Later'})
    }
}

exports.getNewNotifications = async (req, res) => {
    try {
        const [[count]] = await Notification.getCountNewNotification(req.id_user)
        res.status(200).send({number:count.number})
    } catch (error) {
        res.status(200).send({error: 'Something went Wrong! Please try Later'})
    }
}

exports.getNewMessages = async (req, res) => {
    try {
        const [count] = await Message.getCountNewMessages(req.id_user)
        res.status(200).send({number:count.length})
    } catch (error) {
        res.status(200).send({error: 'Something went Wrong! Please try Later'})
    }
}

exports.setNotifStatus = async (req, res) => {
    try {
        await Notification.setStatus(req.id_user, req.body.from, req.body.num)
        res.status(200).send({error: false})
    } catch (error) {
        res.status(200).send({error: 'Something went Wrong! Please try Later'})
    }
}

exports.setMessageStatus = async (req, res) => {
    try {
        User.getByLogin(req.body.profile)
            .then( async ([[user]]) => {
                const check = await Message.setStatus(req.body.status, req.id_user, user.id_user)
                if(check)    
                    res.status(200).send({read: false})
                else
                    res.status(200).send({read: true})
            })
            .catch(err => res.status(200).send({error: 'Something went Wrong! Please try Later'}))
    } catch (error) {
        res.status(200).send({error: 'Something went Wrong! Please try Later'})
    }
}