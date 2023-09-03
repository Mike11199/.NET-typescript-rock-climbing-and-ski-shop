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

module.exports = connectDB;
