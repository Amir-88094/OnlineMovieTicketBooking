import mongoose from "mongoose";
const TheatreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  totalScreens: { type: Number, required: true },
});

export default mongoose.model("Theatre", TheatreSchema);
