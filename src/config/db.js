import { connect } from "mongoose";

const connectDB = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
  }
};

export default connectDB;
