import jwt from "jsonwebtoken";

// ✅ Verify JWT and attach user to request
export const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded = { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

// ✅ Middleware to restrict route access based on role
export const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: "Not authenticated" });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ msg: `Access denied: ${role}s only` });
    }

    next();
  };
};

import User from "../models/User.js";

// Verify JWT Token
export const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalid" });
  }
};

// Check if Admin
