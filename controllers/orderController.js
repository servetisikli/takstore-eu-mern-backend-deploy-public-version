import asyncHandler from "express-async-handler";
import Order from "../models/OrderModel.js";
import { sendOrderConfirmationEmail } from "../utils/emailUtils.js";
import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

// Stripe secret-key

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined in environment variables");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create new order
// @route   POST /api/order
// @access  Public
const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, itemsPrice, customerInfo } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    const taxPrice = Math.round(itemsPrice * 0.19); // 19% tax in cents
    const shippingPrice = 1000; // 10 Euro in cents
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const order = new Order({
      orderItems,
      user: req.user ? req.user._id : null,
      customerInfo,
      shippingAddress,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Send an email to the user with order details
    await sendOrderConfirmationEmail(createdOrder, customerInfo);

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/order/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order status
// @route   PUT /api/order/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status;

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Delete order
// @route   DELETE /api/order/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await order.remove();
    res.json({ message: "Order removed" });
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/order/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

// @desc    Create Stripe payment intent
// @route   POST /api/order/:id/create-payment-intent
// @access  Public
const createPaymentIntent = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: order.totalPrice, // Amount in cents
    currency: "eur",
    payment_method_types: ["card", "sepa_debit", "sofort", "ideal"], // Desteklenen ödeme yöntemleri
    metadata: {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
    },
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
  });
});

// Mevcut updateOrderToPaid fonksiyonunu güncelleyelim
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    // Stripe'dan gelen payment_intent_id'yi doğrula
    const paymentIntent = await stripe.paymentIntents.retrieve(
      req.body.payment_intent_id
    );

    if (paymentIntent.status === "succeeded") {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: paymentIntent.id,
        status: paymentIntent.status,
        update_time: new Date().toISOString(),
        email_address: paymentIntent.receipt_email,
      };

      const updatedOrder = await order.save();

      // Ödeme başarılı olduktan sonra mail gönder
      // await sendOrderConfirmationEmail(updatedOrder, order.customerInfo);

      res.json(updatedOrder);
    } else {
      res.status(400);
      throw new Error("Payment not successful");
    }
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

export {
  addOrderItems,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getMyOrders,
  updateOrderToPaid,
  createPaymentIntent,
};
