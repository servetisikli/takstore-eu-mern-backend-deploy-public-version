import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationExpires: Date,
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: Date,
  },
  {
    timestamps: true,
  }
);

// Presave middleware to hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // Skip the hashing if the password is not modified
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next(); // Call the next middleware
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
