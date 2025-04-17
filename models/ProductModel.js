import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required."],
    },
    price: {
      type: Number,
      required: [true, "Product price is required."],
      min: [0, "Price cannot be less than 0."],
    },
    stock: {
      type: Boolean,
      required: true,
      default: true, // Default to "in stock"
    },
    category: {
      type: String,
      required: [true, "Product category is required."],
    },
    imageUrl: {
      type: String,
      required: false,
    },
    options: [
      {
        name: {
          type: String,
          required: false,
        },
        values: [
          {
            type: String,
            required: false,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;