// server/src/models/counter.js
import mongoose from "mongoose";

// Counter schema for auto-incrementing fields like userId
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // e.g., "userId"
  seq: { type: Number, default: 0 }      // current sequence number
});

const Counter = mongoose.model("Counter", counterSchema);

export default Counter;