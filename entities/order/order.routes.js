const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");
const { authMiddleware, isAdmin } = require("../../middleware/authMiddleware");

// Update order status
router.patch(
  "/admin/:orderId",
  authMiddleware,
  isAdmin,
  orderController.updateOrderStatus
);

// Get all active orders (Admin only)
router.get(
  "/admin",
  authMiddleware,
  isAdmin,
  orderController.getAllOrdersByStatus
);

// Checkout cart and create an order
router.post("/", authMiddleware, orderController.checkoutCart);

// Get details of a specific order
router.get("/:orderId", authMiddleware, orderController.getOrderDetails);

// Get all orders of a user
router.get("/", authMiddleware, orderController.getUserOrders);

module.exports = router;
