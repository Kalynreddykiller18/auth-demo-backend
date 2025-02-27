import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // console.log(conn);
    console.log("Connected to DB");
  } catch (err) {
    console.log(err.message);
  }
};

export default connectDB;
