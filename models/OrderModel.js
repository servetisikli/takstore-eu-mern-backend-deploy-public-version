import mongoose from "mongoose";

// Customer Info Schema
const customerInfoSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

// Order Item Schema
const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Product name
  qty: { type: Number, required: true }, // Quantity
  image: { type: String, required: true }, // Image URL
  price: { type: Number, required: true }, // Price
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
});

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      required: true,
      default: () => {
        const date = new Date();
        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
        const yy = String(date.getFullYear()).slice(-2);
        const randomString = Math.random()
          .toString(36)
          .substring(2, 8)
          .toUpperCase();
        return `ORD-${dd}${mm}${yy}-${randomString}`;
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerInfo: customerInfoSchema,
    orderItems: [orderItemSchema],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    itemsPrice: {
      type: Number,
      required: true,
    },
    taxPrice: {
      type: Number,
      required: true,
    },
    shippingPrice: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "preparing",
      enum: ["preparing", "completed", "cancelled", "partially completed"],
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String },
    },
    deliveredAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
