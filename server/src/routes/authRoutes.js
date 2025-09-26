import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// Public
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected example (only logged in users can hit this)
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ msg: "Welcome to your profile", user: req.user });
});

export default router;