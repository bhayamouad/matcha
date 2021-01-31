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

router.get('/getDataUser', usersController.authorize, usersController.getData)
router.get('/getStatus',usersController.authorize, usersController.getStatus)
router.get('/acceptPrivacy',usersController.authorize, usersController.acceptPrivacy)

router.post('/saveImages', usersController.authorize, usersController.saveImages) 

router.post('/oauth/google', usersController.gglOauth, usersController.connectOrRegister)
router.post('/oauth/facebook', usersController.fbOauth, usersController.connectOrRegister)

router.get('/loggedUser', usersController.authorize, usersController.getLoggedUser)
router.get('/getImages', usersController.authorize, usersController.getUserImages)

router.get('/getSuggestedUser', usersController.authorize, usersController.getSuggestedUser)

module.exports = router