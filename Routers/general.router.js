const express = require('express')
const router = express.Router();
const generalController = require('../Controllers/general.controller')
const auth = require('../Utilitis/authentication')

router.get('/getgeneral',generalController.getGeneral)
router.put('/updategeneral',auth.authMW,generalController.updateGeneral)
router.get('/getcontact',auth.authMW,generalController.getContact)
router.post('/submitcontact',auth.authMW,generalController.createContact)
module.exports = router;