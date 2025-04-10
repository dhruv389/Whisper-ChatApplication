const mongoose = require("mongoose");

const connectDB = async () => {
  
  try {
    await mongoose.connect(process.env.MONGO_URI); // ✅ No deprecated options
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error);
    process.exit(1); // Exit the process on connection failure
  }
};

module.exports = connectDB;
