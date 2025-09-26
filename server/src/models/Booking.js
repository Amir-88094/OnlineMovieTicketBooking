import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    //user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
    showTime: { type: Date },
    seatsBooked: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
