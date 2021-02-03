const router = require('express').Router()  

const usersController = require('../controllers/usersController')
const matchaController = require('../controllers/matchaController')

router.post('/like', usersController.authorize,matchaController.like)


module.exports = router