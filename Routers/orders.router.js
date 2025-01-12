const express = require('express')
const router = express.Router();
const orderController = require('../Controllers/orders.controller')
const auth = require('../Utilitis/authentication')
router.get('/viewallorders',auth.authMW,orderController.viewAllOrders)
router.get('/viewuserorders',auth.authMW,orderController.viewUserOrders)
router.post('/placeorder',auth.authMW,orderController.placeOrder)
router.put('/updateorderstatus',auth.authMW,orderController.updateOrderStatus)
router.delete('/deleteorder',auth.authMW,orderController.deleteOrder)
router.get('/vieworderdetails',auth.authMW,orderController.getOrderDetails)
module.exports = router
