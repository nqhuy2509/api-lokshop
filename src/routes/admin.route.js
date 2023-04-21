const express = require('express')

const router = express.Router()

const BASE_URL = "/api/v1/admin/"

router.post(BASE_URL+"login", require("../controllers/admin.controller").handleLogin)

module.exports = router
