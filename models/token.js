import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  mail: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: { type: Number, default: () => Date.now() },
});

const Token = mongoose.model("Token", tokenSchema);

export default Token;
