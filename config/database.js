const mongoose  = require('mongoose');
const dotenv  = require('dotenv');

dotenv.config({ path: '.env' });

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("Using existing MongoDB connection.");
    return;
  }

  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    console.log("MONGO_URI is not defined in environment variables.");
    throw new Error("MONGO_URI is not defined in environment variables.");
  }

  console.log("Attempting to connect to MongoDB...");

  try {
    console.log(`Connecting to MongoDB with URI: ${mongoURI}`);  
    await mongoose.connect(mongoURI, {
      socketTimeoutMS: 20000,
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false,
    });

    isConnected = true;
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw new Error("Error connecting to MongoDB.");
  }
};
module.exports = connectDB;
