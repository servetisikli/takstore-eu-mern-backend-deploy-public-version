import jwt from "jsonwebtoken";

const generateAccessToken = (user, res) => {
  const accessToken = jwt.sign(
    { userId: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "60m" } // Access Token 60 dakika geçerli
  );

  res.cookie("accessToken", accessToken, {
    httpOnly: true, // XSS saldırılarına karşı koruma
    secure: process.env.NODE_ENV === "production", // HTTPS'te çalışır
    sameSite: "strict", // CSRF saldırılarına karşı koruma
    maxAge: 60 * 60 * 1000, // 60 dakika (MS cinsinden)
  });

  return accessToken;
};

const generateRefreshToken = (user, res) => {
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" } // Refresh Token 30 gün geçerli
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 gün
  });

  return refreshToken;
};

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};

export { generateAccessToken, generateRefreshToken, verifyToken };
