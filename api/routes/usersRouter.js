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

router.post('/setProfile', usersController.authorize, usersController.setProfile) 

router.get('/getTags', usersController.getTags)
router.get('/getStatus',usersController.authorize, usersController.getStatus)
router.get('/acceptPrivacy',usersController.authorize, usersController.acceptPrivacy)

router.post('/saveImages', usersController.authorize, usersController.saveImages) 
router.post('/oauth/google', usersController.gglOauth)
router.post('/oauth/facebook', usersController.fbOauth)


module.exports = router