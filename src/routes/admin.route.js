const express = require('express')
const controller = require("../controllers/admin.controller")
const authenticate = require('../middleware/authenticate')

const router = express.Router()

const BASE_URL = "/api/v1/admin/"

router.post(BASE_URL+"login", controller.handleLogin)

router.get(BASE_URL+"profile", authenticate, controller.getProfile)

module.exports = router
