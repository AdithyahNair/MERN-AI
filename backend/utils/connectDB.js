const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_CONN_STR);
    console.log(`MongoDB connected. Host: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
