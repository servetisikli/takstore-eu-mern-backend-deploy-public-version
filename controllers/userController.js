import User from "../models/UserModel.js";
import asyncHandler from "express-async-handler";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/tokenUtils.js";
import {
  sendVerificationEmail,
  verifyEmailToken,
  resendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/emailUtils.js";

// @desc    Register a new user
// @route   POST /api/user/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    if (!userExists.isEmailVerified) {
      await resendVerificationEmail(email, req);
      res.status(400).json({
        success: false,
        message:
          "User already exists but email is not verified. Verification email resent.",
      });
      return;
    } else {
      res.status(400).json({
        success: false,
        message: "User already exists",
      });
      return;
    }
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  if (user) {
    await sendVerificationEmail(user, req);
    res.status(201).json({
      success: true,
      message: "Registration successful! Please verify your email.",
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid user data",
    });
  }
});

// @desc    Verify email
// @route   GET /api/users/verify-email/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const { token } = req.params;
    await verifyEmailToken(token);
    const frontendUrl = process.env.FRONTEND_URL;
    res.redirect(`${frontendUrl}/register?emailVerified=true`);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Resend verification email
// @route   POST /api/user/resend-verification-email
// @access  Public
const resendVerificationEmailHandler = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    await resendVerificationEmail(email, req);
    res.status(200).json({
      success: true,
      message: "Verification email resent",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Auth user & get token
// @route   POST /api/user/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (!user.isEmailVerified) {
      res.status(401).json({
        success: false,
        message: "Please verify your email to log in.",
      });
      return;
    }
    generateAccessToken(user, res);
    generateRefreshToken(user, res);
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.sendStatus(200);
});

// @desc    Get user profile
// @route   GET /api/user/me
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Refresh access token
// @route   POST /api/user/refresh-token
// @access  Public
const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    res.status(401);
    throw new Error("No refresh token");
  }

  try {
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
    if (!decoded) {
      res.status(401);
      throw new Error("Invalid refresh token");
    }
    generateAccessToken({ _id: decoded.userId, isAdmin: decoded.isAdmin }, res);
    res.sendStatus(200);
  } catch (error) {
    res.status(401);
    throw new Error("Invalid refresh token");
  }
});

// @desc    Send password reset email
// @route   POST /api/user/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  try {
    await sendPasswordResetEmail(user, req);
    res.status(200).json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// @desc    Reset password
// @route   PATCH /api/user/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).json({
      success: false,
      message: "Passwords do not match",
    });
    return;
  }

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
      return;
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export {
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  refreshToken,
  verifyEmail,
  resendVerificationEmailHandler,
  forgotPassword,
  resetPassword,
};
