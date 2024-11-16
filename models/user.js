import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  mail: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: () => Date.now() },
});

const user = mongoose.model("User", userSchema);

export default user;
