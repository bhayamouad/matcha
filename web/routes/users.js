const router = require('express').Router()

const usersController = require('../controllers/users')


router.post('/register', usersController.registerValidation, usersController.registerAccount, usersController.sendEmailVerification)

router.get('/verify/:token', usersController.verifyAccount)

router.post('/login', usersController.login)

<<<<<<< HEAD
router.post('/verify',usersController.updateToken, usersController.sendEmailVerification)
=======
>>>>>>> 79769cda1a9affd437f5d5ab0943a1f7f393c494

module.exports = router