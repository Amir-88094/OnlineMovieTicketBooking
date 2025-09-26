import mongoose from "mongoose";

// Movie schema as per project requirements
const movieSchema = new mongoose.Schema({
  movieID: { type: Number, unique: true }, // MovieID
  Title: { type: String, trim: true },   // Title
  Year: { type: String, trim: true },    // Year
  movieName: { type: String, trim: true }, // MovieName
  language: { type: String, required: true, default: "English" }, // Language
  Runtime: { type: Number, required: true }, // Duration in minutes
  Director: { type: String },        // Optional: Director
  Writer: { type: String },          // Optional: Writer
  genre: { type: String },               // Optional: Genre
  imdbRating: { type: String },        // Optional: IMDB Rating
  releaseDate: { type: Date },           // Optional: Release Date
  director: { type: String },            // Optional: Director name
  cast: [String],                        // Optional: Array of actor names
  rating: { type: Number, min: 0, max: 10 }, // Optional: IMDB rating
  posterUrl: { type: String },           // Optional: Poster URL
  description: { type: String },       // Optional: Movie description
  imageUrl: { type: [String] },       // Optional: Array of image URLs
  shows: [
    {
      showTime: { type: Date, required: true },
      totalSeats: { type: Number, default: 100 },
      bookedSeats: { type: Number, default: 0 },
      availableSeats: { 
        type: Number, 
        default: function() { return this.totalSeats; } 
      }
    }
  ]
}, { timestamps: true });

export default mongoose.model("Movie", movieSchema);
