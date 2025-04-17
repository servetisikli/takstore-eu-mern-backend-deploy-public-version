import express from "express";
import {
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  refreshToken,
  verifyEmail,
  resendVerificationEmailHandler,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register and login routes
router.post("/register", registerUser);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", authUser);
router.post("/logout", logoutUser);

// Resend verification email route
router.post("/resend-verification-email", resendVerificationEmailHandler);

// Forgot password route
router.post("/forgot-password", forgotPassword);

// Reset password route
router.patch("/reset-password/:token", resetPassword);

// Get user profile route
router.get("/me", protect, getUserProfile);
router.get("/admin", protect, admin, getUserProfile);

// Refresh token route
router.post("/refresh-token", refreshToken);

export default router;
