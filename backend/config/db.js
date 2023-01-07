
const mongoose = require("mongoose")

mongoose.set("strictQuery", false);

const connectDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("Mongo DB Connection Success!!")
    } catch (error) {
        console.log("MongoDB Connection Failed!! D:")
        process.exit(1)
    }
}

module.exports = connectDB