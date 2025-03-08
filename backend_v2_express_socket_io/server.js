// load env variables
require("dotenv").config();

// Imports
const express = require("express");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

const app = express();

// Conditionally set up CORS for dev environment (allow requests from front end docker container on port 3000)
if (process.env.NODE_ENV === "development") {
  const cors = require("cors");
  const corsOptions = {
    origin: "http://localhost:3000",
  };
  app.use(cors(corsOptions));
}

// Socket.io init server
const { createServer } = require("http");
const httpServer = createServer(app);
const { Server } = require("socket.io");
global.io = new Server(httpServer);

// Socket.io set up event listeners
const setupSocketEventListeners = require("./socket");
io = setupSocketEventListeners(io);

//************HELMET - TURNED OFF FOR NOW - POSSIBLE HEROKU/SOCKET.IO ISSUES******************** */
// var helmet = require('helmet')
// app.use(helmet({
//   contentSecurityPolicy: false,
//   crossOriginEmbedderPolicy: false,
// }))

//************API RATE LIMITER - TURNED OFF FOR NOW - POSSIBLE HEROKU/SOCKET.IO ISSUES********** */
// const rateLimiter = require("express-rate-limit");

// const apiLimiter = rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 1000,                // more than in authRoutes for fetch requests when filtering
//     message: 'Too many requests from this IP, please try again after 15 minutes',
//   })

// app.use(apiLimiter)

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload());

// Mongodb connection setup.
// *********DISABLED MONGODB CONNECTION FOR API V2 - DATABASE NOW IS POSTGRESQL HANDLED BY .NET API*******
// const connectDB = require("./config/db");
// connectDB();

// Route setup.
const apiRoutes = require("./routes/apiRoutes");
app.use("/api", apiRoutes);

// Serves React frontend in prod (for Heroku only). Not used in ECS for docker container as NGINX does this.
const path = require("path");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.json({ message: "API running..." });
  });
}

/*
 * Error Middleware - Log errors/stack trace to console and send error response to client
 * --------------------------------------------------------
 * In controllers, "next(error)" is used in async code to direct the error
 * to this middleware. Then, the "next(error);" here passes it further forward.
 */
app.use((error, req, res, next) => {
  console.error("Error message:", error.message);
  console.error("Stack trace:", error.stack);
  res.status(500).json({
    message: error.message,
  });
});

const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));      // non-socket.io
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // socket.io
