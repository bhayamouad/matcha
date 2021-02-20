const router = require('express').Router()  

const usersController = require('../controllers/usersController')
const usersMiddleware = require('../middlewares/usersMiddleware')

router.post('/register', usersMiddleware.registerValidation, usersController.registerAccount)

router.post('/login', usersController.login) 
router.get('/logout', usersController.logOut)
router.post('/verify',usersController.updateToken)  
router.get('/verify/:token', usersController.verifyAccount)

router.post('/reset',usersController.resetPassword)
router.get('/reset/:token',usersController.passwordToken)
router.post('/change-password',usersController.changePassword)
router.put('/change-password', usersMiddleware.authorize, usersMiddleware.checkIfValidPass, usersController.changePassword) 

router.post('/authorization', usersMiddleware.authorize, usersController.authorized) 

router.post('/setProfile', usersMiddleware.authorize, usersMiddleware.checkIfExist, usersController.setProfile) 

router.get('/getDataUser', usersMiddleware.authorize, usersController.getDataUser)
router.get('/getStatus',usersMiddleware.authorize, usersController.getStatus)

router.post('/saveImages', usersMiddleware.authorize, usersController.saveImages) 

router.post('/oauth/42', usersMiddleware.e42Oauth, usersController.connectOrRegister)
router.post('/oauth/facebook', usersMiddleware.fbOauth, usersController.connectOrRegister)
router.get('/isoauth', usersMiddleware.authorize, usersController.isOauth)

router.get('/loggedUser', usersMiddleware.authorize, usersController.getLoggedUser)
router.get('/getImages', usersMiddleware.authorize, usersController.getUserImages)

router.get('/getPosition', usersMiddleware.authorize, usersController.getPositon)
router.put('/setPosition', usersMiddleware.authorize, usersController.setPosition)

router.post('/getprofile', usersMiddleware.authorize, usersController.getProfileInfo)
router.post('/reportuser', usersMiddleware.authorize, usersController.reportUser)
router.post('/blockuser', usersMiddleware.authorize, usersController.blockUser)



module.exports = router