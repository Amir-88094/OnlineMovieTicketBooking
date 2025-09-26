import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import authRoutes from "./src/routes/authRoutes.js";
import movieRoutes from "./src/routes/movieRoutes.js";
import bookingRoutes from "./src/routes/bookingRoutes.js";
import adminRouter from "./src/routes/adminRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRouter);
// Health check route
app.get("/", (req, res) => {
  res.send("🎬 Cinema Ticket Booking API is running!");
});

// Database connection and server start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Error: MONGO_URI not set in .env file");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected ✅");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection error:", err));
