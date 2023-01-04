const express = require('express')
const router = express.Router()
const getProducts = require("../controllers/productController")


//https://www.geeksforgeeks.org/express-js-express-router-function/


router.get("/", getProducts)

module.exports = router