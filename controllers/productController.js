import asyncHandler from "express-async-handler";
import Product from "../models/ProductModel.js";

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
});

// @desc    Get a single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found.");
  }
  res.status(200).json(product);
});

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { category } = req.params;
  const products = await Product.find({ category: category.toLowerCase() });

  if (products.length === 0) {
    res.status(404);
    throw new Error("No products found in this category.");
  }

  res.status(200).json(products);
});

// @desc    Search products by query
// @route   GET /api/products/search
// @access  Public
const searchProducts = asyncHandler(async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ message: "Query parameter is required." });
    }

    // Ensure the query is targeting the 'name' and 'category' fields only
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(products);
  } catch (error) {
    console.error("Error during product search:", error);
    res.status(500).json({ message: "Failed to search products.", error });
  }
});

export {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
};
