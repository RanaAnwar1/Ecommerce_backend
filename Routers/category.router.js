const express = require('express')
const router = express.Router();
const categoryController = require('../Controllers/category.controller')
const upload = require('../config/multerConfig')
const auth = require('../Utilitis/authentication')
router.get('/getcategory',categoryController.getCategory)
router.get('/getsubcategory',categoryController.getSubCategory)
router.post('/createcategory',auth.authMW,upload.single('categoryImage'),categoryController.createCategory)
router.post('/createsubcategory',auth.authMW,categoryController.createSubCategory)
router.put('/updatecategory',auth.authMW,upload.single('categoryImage'),categoryController.updateCategory)
router.put('/updatesubcategory',auth.authMW,categoryController.updateSubCatgeory)
router.delete('/deletecategory',auth.authMW,categoryController.deleteCategory)
router.delete('/deletesubcategory',auth.authMW,categoryController.deleteSubCategory)

module.exports = router