import express from "express";
import { bookTickets, getUserBookings } from "../controllers/bookingController.js";
import { authMiddleware, authorizeRole } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// Create a booking (User only)
router.post("/book", authMiddleware, authorizeRole("user"), bookTickets);

// Get all bookings of the logged-in user
router.get("/my-bookings", authMiddleware, authorizeRole("user"), getUserBookings);

export default router;