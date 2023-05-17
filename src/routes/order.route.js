
const router = require('express').Router()
const authenticate = require('../middleware/authenticate')
const controller = require('../controllers/order.controller')

const BASE_URL = "/api/v1/order/"

router.get(BASE_URL + ':id', authenticate, controller.getOrderById)
router.get(BASE_URL, authenticate, controller.getAllOrder)
router.post(BASE_URL, authenticate, controller.createNewOrder)

module.exports = router