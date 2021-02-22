const router = require('express').Router()  

const usersMiddleware = require('../middlewares/usersMiddleware')
const matchaController = require('../controllers/matchaController')
const historyController = require('../controllers/historyController')

router.post('/like', usersMiddleware.authorize,matchaController.like)
router.post('/unlike',usersMiddleware.authorize, matchaController.unLike)
router.post('/reject', usersMiddleware.authorize, matchaController.reject)
router.post('/gethistory', usersMiddleware.authorize, historyController.getHistory)
router.get('/getSuggestedUser', usersMiddleware.authorize, matchaController.getSuggestedUser)
router.post('/search', usersMiddleware.authorize, matchaController.getSearchedUser)

module.exports = router