const bcrypt = require("bcryptjs")
const salt = bcrypt.genSaltSync(10)

const hashPassword = password => bcrypt.hashSync(password, salt)
module.exports = { hashPassword }
