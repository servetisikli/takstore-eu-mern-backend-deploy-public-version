import { verifyToken } from "../utils/tokenUtils.js";
import User from "../models/UserModel.js";

// Middleware to verify if the user is authenticated
const protect = async (req, res, next) => {
  const token = req.cookies.accessToken; // Get the token from HttpOnly Cookie

  if (!token) {
    return res.status(401).json({ message: "Unauthorized, no token found" });
  }

  try {
    // Verify the token
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    req.user = await User.findById(decoded.userId).select("-password"); // Get user information
    next(); // Continue
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware to verify if the user is an admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // Continue if the user has admin privileges
  } else {
    res
      .status(403)
      .json({ message: "Unauthorized, admin privileges required" });
  }
};

export { protect, admin };
