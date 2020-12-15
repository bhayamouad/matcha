const router = require('express').Router()

const usersController = require('../controllers/usersController')


router.post('/register', usersController.registerValidation, usersController.registerAccount)

router.get('/verify/:token', usersController.verifyAccount)

router.post('/login', usersController.login)

router.post('/verify',usersController.updateToken)

router.post('/reset',usersController.resetPassword)

router.post('/changePassword',usersController.changePassword)

module.exports = router