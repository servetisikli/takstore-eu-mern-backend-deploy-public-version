import express from "express";
import {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
} from "../controllers/productController.js";

const router = express.Router();

// Search products
router.get("/search", searchProducts);

// Get all products
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.get("/category/:category", getProductsByCategory);

export default router;
