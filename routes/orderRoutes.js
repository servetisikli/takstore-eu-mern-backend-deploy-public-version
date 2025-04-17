import express from "express";
import {
  addOrderItems,
  updateOrderToPaid,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
  getMyOrders,
  createPaymentIntent,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { protectCheckout } from "../middleware/protectCheckout.js";

const router = express.Router();

router.post("/", protectCheckout, addOrderItems); // Create new order
router.put("/:id/pay", updateOrderToPaid); // Update order to paid
router.put("/:id/status", protect, admin, updateOrderStatus); // Update order status
router.delete("/:id", protect, admin, deleteOrder); // Delete order
router.get("/myorders", protect, getMyOrders); // Get logged in user orders
router.get("/:id", protect, getOrderById); // Get order by ID
router.post("/:id/create-payment-intent", createPaymentIntent); // Create payment intent

export default router;
