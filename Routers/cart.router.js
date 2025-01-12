const express = require('express')
const router = express.Router();
const cartController = require('../Controllers/cart.controller')
const auth = require('../Utilitis/authentication');
router.get('/viewcart',auth.authMW,cartController.viewCart)
router.get('/viewallcarts',auth.authMW,cartController.viewAllCarts)
router.delete('/deletecart',auth.authMW,cartController.deleteCart)
router.put('/updatecart', auth.authMW, cartController.updateCart); 
router.delete('/removeproduct', auth.authMW, cartController.removeProductFromCart);
router.get('/viewcartdetails',auth.authMW, cartController.viewCartDetails)
module.exports = router