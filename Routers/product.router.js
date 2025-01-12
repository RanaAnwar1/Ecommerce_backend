const express = require('express')
const router = express.Router();
const upload = require('../config/multerConfig')
const productController = require('../Controllers/product.controller')
const auth = require('../Utilitis/authentication')
router.get('/getproducts',productController.getProducts)
router.get('/getproductdetails',productController.getProductDetails)
router.post('/createproduct',auth.authMW,upload.array('productImages', 5),productController.createProduct)
router.put('/updateproduct',auth.authMW,upload.array('productImages', 5),productController.updateProduct)
router.delete('/deleteproduct',auth.authMW,productController.deleteProduct)


module.exports = router  