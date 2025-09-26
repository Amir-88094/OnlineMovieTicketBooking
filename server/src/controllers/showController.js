import Show from "../models/Show.js";

// Add Show
export const addShow = async (req, res) => {
  try {
    console.log("=== AddShow Debug Info ===");
    console.log("Raw request body:", req.body);
    console.log("Request body type:", typeof req.body);
    console.log("Request headers:", req.headers);

    // Check if req.body exists and is an object
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        message:
          "Invalid request body. Make sure you're sending JSON data with Content-Type: application/json header",
        receivedBody: req.body,
        bodyType: typeof req.body,
        headers: req.headers,
      });
    }

    console.log("Request body:", JSON.stringify(req.body, null, 2));

    // Validate required fields
    const requiredFields = [
      "theatreName",
      "movieName",
      "startTime",
      "endTime",
      "price",
      "screenNumber",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required fields",
        missingFields,
        receivedFields: Object.keys(req.body),
        requiredFields,
        example: {
          theatreName: "PVR Cinemas",
          movieName: "Inception",
          startTime: "2025-09-25T14:00:00.000Z",
          endTime: "2025-09-25T16:30:00.000Z",
          price: 250,
          screenNumber: 1,
        },
      });
    }

    // Validate string fields
    if (
      typeof req.body.theatreName !== "string" ||
      req.body.theatreName.trim().length === 0
    ) {
      return res.status(400).json({
        message: "theatreName must be a non-empty string",
        received: req.body.theatreName,
      });
    }

    if (
      typeof req.body.movieName !== "string" ||
      req.body.movieName.trim().length === 0
    ) {
      return res.status(400).json({
        message: "movieName must be a non-empty string",
        received: req.body.movieName,
      });
    }

    // Validate date formats
    const startTime = new Date(req.body.startTime);
    const endTime = new Date(req.body.endTime);

    if (isNaN(startTime.getTime())) {
      return res.status(400).json({
        message:
          "Invalid startTime format. Use ISO date format like '2025-09-25T14:00:00.000Z'",
        received: req.body.startTime,
      });
    }

    if (isNaN(endTime.getTime())) {
      return res.status(400).json({
        message:
          "Invalid endTime format. Use ISO date format like '2025-09-25T16:30:00.000Z'",
        received: req.body.endTime,
      });
    }

    if (endTime <= startTime) {
      return res.status(400).json({
        message: "endTime must be after startTime",
        startTime: req.body.startTime,
        endTime: req.body.endTime,
      });
    }

    const show = new Show(req.body);
    await show.save();
    res.status(201).json({
      message: "Show added successfully",
      show,
    });
  } catch (err) {
    console.error("Error in addShow:", err);

    // Handle specific MongoDB errors
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.keys(err.errors).map((key) => ({
          field: key,
          message: err.errors[key].message,
        })),
      });
    }

    res.status(500).json({ message: err.message });
  }
};

// Edit Show
export const editShow = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const show = await Show.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.json({
      message: "Show updated successfully",
      show,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Show
export const deleteShow = async (req, res) => {
  try {
    const { id } = req.params;

    const show = await Show.findByIdAndDelete(id);
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.json({ message: "Show deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Shows
export const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find();
    res.json(shows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Show by ID
export const getShowById = async (req, res) => {
  try {
    const { id } = req.params;
    const show = await Show.findById(id);

    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    res.json(show);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
