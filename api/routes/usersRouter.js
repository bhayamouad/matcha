const router = require('express').Router()

const usersController = require('../controllers/usersController')


router.post('/register', usersController.registerValidation, usersController.registerAccount, usersController.sendEmailVerification)

router.get('/verify/:token', usersController.verifyAccount)

router.post('/login', usersController.login)


router.post('/verify',usersController.updateToken, usersController.sendEmailVerification)

router.post('/reset',usersController.resetPassword, usersController.sendEmailReset)
router.post('/changePassword',usersController.changePassword)

module.exports = router