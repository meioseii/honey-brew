const express = require("express");
const router = express.Router();
const orderController = require("./order.controller");
const { authMiddleware, isAdmin } = require("../../middleware/authMiddleware");

router.patch(
  "/admin/:orderId",
  authMiddleware,
  isAdmin,
  orderController.updateOrderStatus
);

router.get(
  "/admin",
  authMiddleware,
  isAdmin,
  orderController.getAllOrdersByStatus
);

router.post("/", authMiddleware, orderController.checkoutCart);

router.get("/:orderId", authMiddleware, orderController.getOrderDetails);

router.get("/", authMiddleware, orderController.getUserOrders);

module.exports = router;
