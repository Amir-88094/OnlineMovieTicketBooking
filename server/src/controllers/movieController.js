import Movie from "../models/Movie.js";

// Add Movie
export const addMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json({
      message: "Movie added successfully",
      movie,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Edit Movie
export const editMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    console.log("=== EditMovie Debug Info ===");
    console.log("Movie ID:", id);
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Updates object:", JSON.stringify(updates, null, 2));

    // Check if ID is valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid movie ID format" });
    }

    // Check if there are actually updates to apply
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: "No updates provided",
        receivedBody: req.body,
      });
    }

    // Validate that the fields being updated are valid Movie schema fields
    const validFields = [
      "movieID",
      "movieName",
      "language",
      "duration",
      "genre",
      "releaseDate",
      "director",
      "cast",
      "rating",
      "posterUrl",
      "description",
      "shows",
    ];

    const receivedFields = Object.keys(updates);
    const invalidFields = receivedFields.filter(
      (field) => !validFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: "Invalid field names detected",
        invalidFields,
        receivedFields,
        validFields,
        note: "Check for typos in field names (e.g., 'language' not 'langauge')",
      });
    }

    // Find the movie first to see if it exists
    const existingMovie = await Movie.findById(id);
    if (!existingMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    console.log(
      "Existing movie before update:",
      JSON.stringify(existingMovie, null, 2)
    );

    const movie = await Movie.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    console.log("Updated movie:", JSON.stringify(movie, null, 2));

    res.json({
      message: "Movie updated successfully",
      movie,
      updatedFields: Object.keys(updates),
    });
  } catch (err) {
    console.error("Error in editMovie:", err);
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Movie with this movieID already exists",
        field: "movieID",
      });
    }
    res.status(500).json({ message: err.message });
  }
};

// Delete Movie
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json({ message: "Movie deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Movies
export const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Movie
export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
