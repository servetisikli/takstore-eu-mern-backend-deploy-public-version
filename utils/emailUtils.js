import crypto from "crypto";
import sendEmail from "../services/emailService.js";
import User from "../models/UserModel.js";
import formatPrice from "./formatPrice.js";

export const generateEmailVerificationToken = (user) => {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  user.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 saat geçerli
  return verificationToken;
};

export const sendVerificationEmail = async (user, req) => {
  const verificationToken = generateEmailVerificationToken(user);
  await user.save({ validateBeforeSave: true });

  const verificationUrl = `${req.protocol}s://${req.get(
    "host"
  )}/api/user/verify-email/${verificationToken}`;

  const message = `
    Hello ${user.firstName} ${user.lastName},\n\n
    To verify your email address, please click on the following link:\n
    <a href="${verificationUrl}">click here</a>\n\n
    If the link does not work, you can copy and paste the following URL into your browser:\n
    ${verificationUrl}\n\n
    If you did not request this, please ignore this email.
  `;

  await sendEmail({
    email: user.email,
    subject: "Email Verification",
    message,
  });
};

export const verifyEmailToken = async (token) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }, // Süre kontrolü
  });

  if (!user) {
    throw new Error("Invalid or expired token!");
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  return user;
};

export const resendVerificationEmail = async (email, req) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isEmailVerified) {
    throw new Error("Email is already verified");
  }

  await sendVerificationEmail(user, req);
};

export const generatePasswordResetToken = (user) => {
  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  user.resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 saat geçerli
  return resetToken;
};

export const sendPasswordResetEmail = async (user, req) => {
  const resetToken = generatePasswordResetToken(user);
  await user.save({ validateBeforeSave: true });

  const frontendUrl = process.env.FRONTEND_URL;
  const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

  const message = `
    Hello ${user.firstName} ${user.lastName},\n\n
    To reset your password, please click on the following link:\n
    <a href="${resetUrl}">click here</a>\n\n
    If the link does not work, you can copy and paste the following URL into your browser:\n
    ${resetUrl}\n\n
    If you did not request this, please ignore this email.
  `;

  await sendEmail({
    email: user.email,
    subject: "Password Reset",
    message,
  });
};

export const sendOrderConfirmationEmail = async (order, customerInfo) => {
  const message = `
    Hello ${customerInfo.firstName} ${customerInfo.lastName},\n\n
    Your order has been successfully placed. Here are your order details:\n
    Order Number: ${order.orderNumber}\n
    Total Amount: ${formatPrice(order.totalPrice)}\n
    Order Status: ${order.status}\n\n
    You can log in to your account to check the status of your order.\n\n\n
    This is a test message.
  `;

  await sendEmail({
    email: customerInfo.email,
    subject: "Order Confirmation",
    message,
  });
};
