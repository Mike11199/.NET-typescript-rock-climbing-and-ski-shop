const express = require('express')

//https://www.geeksforgeeks.org/express-js-express-router-function/
const router = express.Router()

router.get("/", (req, res) => {
    res.send("handling product routes here")
})

module.exports = router