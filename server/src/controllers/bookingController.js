import Booking from "../models/Booking.js";
import Movie from "../models/Movie.js";
import mongoose from "mongoose";

// Create a booking
export const bookTickets = async (req, res) => {
  try {
    const { movieID, showTime, seatsRequested } = req.body;
    if (!movieID || !showTime || !seatsRequested) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Check if movieID is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(movieID)) {
      return res.status(400).json({ msg: "Invalid movie ID" });
    }

    // Convert movieID to ObjectId
    const movieObjectId = new mongoose.Types.ObjectId(movieID);

    // Find movie
    const movie = await Movie.findOne({ _id: movieObjectId });
    if (!movie) return res.status(404).json({ msg: "Movie not found" });

    // Find the show
    const show = movie.shows.find(
      (s) => s.showTime.toISOString() === new Date(showTime).toISOString()
    );
    if (!show) return res.status(404).json({ msg: "Show not found" });

    // Check seats availability
    if (show.availableSeats < seatsRequested) {
      return res.status(400).json({ msg: "Not enough seats available" });
    }

    // Use req.user._id for the user (since it's set in authMiddleware)
    const booking = new Booking({
      user: req.user._id,  // Don't pass user in the request body
      movie: movie._id,
      showTime: show.showTime,
      seatsBooked: seatsRequested,
    });
    await booking.save();

    // Update seats
    show.bookedSeats += seatsRequested;
    show.availableSeats -= seatsRequested;
    await movie.save();

    res.status(201).json({ msg: "Booking successful", booking });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};


// Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("movie", "movieName");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
