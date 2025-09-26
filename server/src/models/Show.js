import mongoose from "mongoose";

const showSchema = new mongoose.Schema(
  {
    theatreName: {
      type: String,
      required: true,
    },
    movieName: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    screenNumber: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Show", showSchema);
