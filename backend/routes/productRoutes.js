const express = require('express')
const router = express.Router()
const getProducts = require("../controllers/productController")

router.get("/category/:categoryName", getProducts)
router.get("/", getProducts)

module.exports = router
