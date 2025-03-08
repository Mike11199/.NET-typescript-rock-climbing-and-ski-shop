// load env variables
require("dotenv").config();

// Imports
const express = require("express");
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
