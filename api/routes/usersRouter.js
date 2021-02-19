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
router.put('/change-password', usersController.authorize, usersController.checkIfValidPass,usersController.changePassword) 


router.post('/authorization', usersController.authorize, usersController.authorized) 

router.post('/setProfile', usersController.authorize, usersController.checkIfExist, usersController.setProfile) 

router.get('/getDataUser', usersController.authorize, usersController.getData)
router.get('/getStatus',usersController.authorize, usersController.getStatus)

router.post('/saveImages', usersController.authorize, usersController.saveImages) 

router.post('/oauth/42', usersController.e42Oauth, usersController.connectOrRegister)
router.post('/oauth/facebook', usersController.fbOauth, usersController.connectOrRegister)
router.get('/isoauth', usersController.authorize, usersController.isOauth)

router.get('/loggedUser', usersController.authorize, usersController.getLoggedUser)
router.get('/getImages', usersController.authorize, usersController.getUserImages)

router.get('/getSuggestedUser', usersController.authorize, usersController.getSuggestedUser)

router.get('/getPosition', usersController.authorize, usersController.getPositon)
router.put('/setPosition', usersController.authorize, usersController.setPosition)

router.post('/getprofile', usersController.authorize, usersController.getProfileInfo)



module.exports = router