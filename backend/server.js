const express = require('express')
const app = express()
const port = 3000

const apiRoutes = require("./routes/apiRoutes")

app.get('/', (req, res) => {
  res.json({message: "API Running"})
})


app.use('/api',apiRoutes)
// app.get('/api/products', (req, res) => {
//   res.send("handle product routes here!!")
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
