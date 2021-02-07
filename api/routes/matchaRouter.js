const router = require('express').Router()  

const usersController = require('../controllers/usersController')
const matchaController = require('../controllers/matchaController')
const historyController = require('../controllers/historyController')

router.post('/like', usersController.authorize,matchaController.like)
router.post('/reject', usersController.authorize, matchaController.reject)
router.post('/gethistory', usersController.authorize, historyController.getHistory)

module.exports = router