const router = require('express').Router()

const usersController = require('../controllers/users')


router.post('/register', usersController.registerValidation, usersController.registerAccount, usersController.sendEmailVerification)

router.get('/verify/:token', usersController.verifyAccount)

router.post('/login', usersController.login)

router.post('/verify',usersController.updateToken, usersController.sendEmailVerification)

module.exports = router