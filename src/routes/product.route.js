const authenticate = require('../middleware/authenticate')
const { upload } = require('../middleware/upload')
const controller = require('../controllers/product.controller')

const router = require('express').Router()

const BASE_URL = "/api/v1/product/"

router.post(BASE_URL, authenticate, upload.single('image'), controller.addNewProduct)

module.exports = router