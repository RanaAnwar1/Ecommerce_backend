const express = require('express')
const router = express.Router();
const userController = require('../Controllers/users.controller')
const auth = require('../Utilitis/authentication')
router.get('/getusers',auth.authMW,userController.getUsers)
router.post('/createuser',auth.authMW,userController.createUser)
router.post('/login',userController.login)
router.get('/getuserdetails',userController.getUserDetails)
router.put('/updateuserprofile',userController.updateUserProfile)
router.delete('/deleteuser',auth.authMW,userController.deleteUser)
router.post('/registeruser',userController.registerUser)

module.exports = router