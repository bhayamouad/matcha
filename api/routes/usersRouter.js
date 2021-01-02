const router = require('express').Router()

const usersController = require('../controllers/usersController')

router.post('/register', usersController.registerValidation, usersController.registerAccount)

router.post('/login', usersController.login)
router.get('/logout', usersController.logOut)

router.post('/verify',usersController.updateToken)
router.get('/verify/:token', usersController.verifyAccount)

router.post('/reset',usersController.resetPassword)
router.get('/reset/:token',usersController.passwordToken)
router.post('/change-password',usersController.changePassword)

router.post('/authorization', usersController.authorize, usersController.authorized)

module.exports = router