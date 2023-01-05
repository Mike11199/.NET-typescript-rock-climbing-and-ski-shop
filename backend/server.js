const express = require('express')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const app = express()
const port = 5000


app.use(express.json())
app.use(fileUpload())
app.use(cookieParser())

//use 'npx nodemon' to start server as nodemon is dev dependency

const apiRoutes = require("./routes/apiRoutes")

app.get('/', (req, res) => {
  res.json({message: "API Running"})
  
})


//MongoDB connection
const connectDB = require("./config/db")
connectDB();


app.use('/api',apiRoutes)

app.use((error, req, res, next) => {
  console.error(error);
  next(error)
})

app.use((error, req, res, next) => {
  res.status(500).json({
      message: error.message,
      stack: error.stack
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
