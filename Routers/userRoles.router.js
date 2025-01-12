const express = require('express')
const router = express.Router();
const userRoleController = require('../Controllers/userRoles.controller')
const auth = require('../Utilitis/authentication')

router.get('/getuserroles',auth.authMW,userRoleController.getUserRoles)
router.post('/createuserrole',auth.authMW,userRoleController.createUserRole)
router.delete('/deleteuserrole',auth.authMW,userRoleController.deleteUserRole)
router.put('/updateuserrole',auth.authMW,userRoleController.updateUserRole)
module.exports = router