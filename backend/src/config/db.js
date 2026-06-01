import mongoose from "mongoose";

const connectDb = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri === "your_mongodb_connection_string") {
    throw new Error("MONGO_URI is not configured.");
  }

  const connection = await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${connection.connection.host}`);
};

export default connectDb;
