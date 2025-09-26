import mongoose from "mongoose";
import Counter from "./counter.js";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, },
  age: { type: Number },
  gender: { type: String, enum: ["male", "female", "other"] },
  address: { type: String },
  phoneNo: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  role: { type: String, enum: ["user", "admin"], default: "user" },
  userId: { type: Number, unique: true }
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findOneAndUpdate(
        { _id: "userId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.userId = counter.seq;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

export default mongoose.model("User", userSchema);