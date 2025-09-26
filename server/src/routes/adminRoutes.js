import express from "express";
import {
  addTheatre,
  editTheatre,
  deleteTheatre,
  getTheatres,
  getTheatreById,
} from "../controllers/theatreController.js";
import {
  addShow,
  editShow,
  deleteShow,
  getShowById,
  getAllShows,
} from "../controllers/showController.js";
import {
  addMovie,
  editMovie,
  deleteMovie,
  getAllMovies,
  getMovieById,
} from "../controllers/movieController.js";
import { protect, authorizeRole } from "../middlewares/authMiddlewares.js";
const adminRouter = express.Router();

// Theatres
adminRouter.post("/theatres", protect, authorizeRole("admin"), addTheatre);
adminRouter.put("/theatres/:id", protect, authorizeRole("admin"), editTheatre);
adminRouter.delete(
  "/theatres/:id",
  protect,
  authorizeRole("admin"),
  deleteTheatre
);
adminRouter.get("/theatres/:id", getTheatreById);
adminRouter.get("/theatres", getTheatres);

// Shows
adminRouter.post("/shows", protect, authorizeRole("admin"), addShow);
adminRouter.put("/shows/:id", protect, authorizeRole("admin"), editShow);
adminRouter.delete("/shows/:id", protect, authorizeRole("admin"), deleteShow);
adminRouter.get("/shows/:id", getShowById);
adminRouter.get("/shows", getAllShows);

// Movies
adminRouter.post("/movies", protect, authorizeRole("admin"), addMovie);
adminRouter.put("/movies/:id", protect, authorizeRole("admin"), editMovie);
adminRouter.delete("/movies/:id", protect, authorizeRole("admin"), deleteMovie);
adminRouter.get("/movies", getAllMovies);
adminRouter.get("/movies/:id", getMovieById);

export default adminRouter;
