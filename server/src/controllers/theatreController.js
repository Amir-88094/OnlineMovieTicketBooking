import Theatre from "../models/Theatre.js";

// Add Theatre
export const addTheatre = async (req, res) => {
  try {
    const theatre = new Theatre(req.body);
    await theatre.save();
    res.status(201).json(theatre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Edit Theatre
// Edit Theatre (Update theatre details)
export const editTheatre = async (req, res) => {
  try {
    const { id } = req.params; // Theatre ID from URL
    const updates = req.body; // Fields to update

    // Find and update theatre
    const theatre = await Theatre.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!theatre) {
      return res.status(404).json({ message: "Theatre not found" });
    }

    res.json({
      message: "Theatre updated successfully",
      theatre,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Theatre
export const deleteTheatre = async (req, res) => {
  try {
    await Theatre.findByIdAndDelete(req.params.id);
    res.json({ message: "Theatre deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// View All Theatres
export const getTheatres = async (req, res) => {
  try {
    const theatres = await Theatre.find();
    res.json(theatres);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Theatre by ID
export const getTheatreById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid theatre ID format" });
    }

    const theatre = await Theatre.findById(id);

    if (!theatre) {
      return res.status(404).json({ message: "Theatre not found" });
    }

    res.json(theatre);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
