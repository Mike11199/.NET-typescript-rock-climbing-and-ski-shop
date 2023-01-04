const express = require('express')
const router = express.Router()
const {getUsers, registerUser} = require("../controllers/userController")

router.post("/register", registerUser)

// user logged in routes:

// admin routes:
router.get("/", getUsers)

module.exports = router
