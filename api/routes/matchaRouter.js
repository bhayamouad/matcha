const router = require('express').Router()  

const usersMiddleware = require('../middlewares/usersMiddleware')
const matchaController = require('../controllers/matchaController')
const logsController = require('../controllers/logsController')

router.post('/like', usersMiddleware.authorize,matchaController.like)
router.post('/unlike',usersMiddleware.authorize, matchaController.unLike)
router.post('/reject', usersMiddleware.authorize, matchaController.reject)
router.post('/gethistory', usersMiddleware.authorize, logsController.getHistory)
router.get('/getSuggestedUser', usersMiddleware.authorize, matchaController.getSuggestedUser)
router.post('/search', usersMiddleware.authorize, matchaController.getSearchedUser)
router.post('/getnotifications', usersMiddleware.authorize, logsController.getNotifications)
router.get('/getNewNotification', usersMiddleware.authorize, logsController.getNewNotifications)

module.exports = router