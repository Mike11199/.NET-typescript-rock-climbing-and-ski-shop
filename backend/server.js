require("dotenv").config();
var helmet = require('helmet')


const express = require("express");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const app = express();

//Block below is for socket.io
const { createServer } = require("http")
const { Server } = require("socket.io")
const httpServer = createServer(app)
global.io = new Server(httpServer)    //global variable

//back end connects to front end with this code, listening for this message
io.on("connection", (socket) => {
  
  //server listens for a client message
  socket.on("client sends message", (msg) => {
      console.log(msg);
      //server takes message received and emits to admin
      socket.broadcast.emit("server sends message from client to admin",{
        message: msg
      })
  })
  
  

  
  //server listens for admin message
  socket.on('admin sends message', ({message}) => {
    //server takes message from admin and emits back to clients
    socket.broadcast.emit("server sends message from admin to client", message)
   })
})

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}))

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

const apiRoutes = require("./routes/apiRoutes");


// mongodb connection
const connectDB = require("./config/db");
connectDB();

app.use("/api", apiRoutes);

const path = require("path");
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/build")));
    app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html")));
} else {
   app.get("/", (req,res) => {
      res.json({ message: "API running..." }); 
   }) 
}

app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.error(error);
  }
  next(error);
});
app.use((error, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    res.status(500).json({
      message: error.message,
      stack: error.stack,
    });
  } else {
    res.status(500).json({
      message: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));