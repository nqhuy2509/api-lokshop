const authenticate = require('../middleware/authenticate')
const { upload } = require('../middleware/upload')
const controller = require('../controllers/product.controller')

const router = require('express').Router()

const BASE_URL = "/api/v1/product/"

router.get(BASE_URL+'categories', controller.getAllCategory)

router.post(BASE_URL, authenticate, upload.single('image'), controller.addNewProduct)
router.get(BASE_URL,controller.getAllProduct)
router.get(BASE_URL+':id', controller.getProductById)
router.put(BASE_URL, authenticate, upload.single('image'), controller.updateProductById)
router.delete(BASE_URL, authenticate, controller.deleteProductById)


module.exports = router