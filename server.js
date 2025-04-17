import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import helmet from "helmet";

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS (Cross-Origin Resource Sharing)
const corsOptions = {
  origin: (origin, callback) => {
    // .env'den base domaini al
    const baseDomain = process.env.CORS_ORIGIN_BASE;

    // İzinli origin'leri oluştur
    const allowedOrigins = [
      `http://${baseDomain}`,
      `http://www.${baseDomain}`,
      `https://${baseDomain}`,
      `https://www.${baseDomain}`,
    ];

    // Origin kontrolü
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // İzin ver
    } else {
      callback(new Error("CORS hatası: Erişim izni yok.")); // Hata ver
    }
  },
  credentials: true, // Çerez gönderimine izin ver
};
app.use(cors(corsOptions));

// Preflight isteklerini ele almak için
app.options("*", cors(corsOptions));

// Middleware
app.use(helmet()); // Secure the app by setting various HTTP headers
app.use(express.json());
app.use(cookieParser());

// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// Routes
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order", orderRoutes);

// Default port is 5000
const PORT = process.env.PORT || 5000;

// Listen to port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
