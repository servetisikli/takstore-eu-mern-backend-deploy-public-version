import { verifyToken } from "../utils/tokenUtils.js";
import User from "../models/UserModel.js";

// Middleware to verify if the user is authenticated
const protectCheckout = async (req, res, next) => {
  const token = req.cookies.accessToken; // Get the token from HttpOnly Cookie

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    // Verify the token
    const decoded = verifyToken(token, process.env.JWT_SECRET);
    if (!decoded) {
      req.user = null;
      return next();
    }
    req.user = await User.findById(decoded.userId).select("-password"); // Get user information
    next(); // Continue
  } catch (error) {
    req.user = null;
    next();
  }
};

export { protectCheckout };