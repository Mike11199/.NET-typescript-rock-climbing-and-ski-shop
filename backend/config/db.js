const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const connectDB = async () => {
  let message = "";

  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    message = "Mongo DB Connection Success!";
    console.log(message);
  } catch (error) {
    message = "MongoDB Connection Failed!";
    console.log(message);
  }
};

  // Listen to connection events
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected!');
  });

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
    mongoose.disconnect();
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
    setTimeout(connectDB, 5000);
  });


module.exports = connectDB;
