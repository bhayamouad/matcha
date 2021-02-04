const router = require('express').Router()  

const usersController = require('../controllers/usersController')
const matchaController = require('../controllers/matchaController')

router.post('/like', usersController.authorize,matchaController.like)
router.post('/reject', usersController.authorize, matchaController.reject)

module.exports = router