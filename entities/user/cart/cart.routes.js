const express = require("express");
const router = express.Router();
const cartController = require("./cart.controller");
const { authMiddleware } = require("../../../middleware/authMiddleware");

router.post("/", authMiddleware, cartController.addItemToCart);
router.get("/", authMiddleware, cartController.getUserCartItems);
router.delete("/:productId", authMiddleware, cartController.deleteItemFromCart);
router.patch(
  "/:productId",
  authMiddleware,
  cartController.updateProductQuantityInCart
);

module.exports = router;
