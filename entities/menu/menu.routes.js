const express = require("express");
const router = express.Router();
const menuController = require("./menu.controller");
const { authMiddleware, isAdmin } = require("../../middleware/authMiddleware");

router.post("/", authMiddleware, isAdmin, menuController.addMenuProduct);
router.get("/:category", menuController.getMenuProductsByCategory);
router.get("/:category/:id", menuController.getMenuProductById);
router.get("/", menuController.getAllMenuProducts);
router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  menuController.deleteMenuProduct
);
router.put("/:id", authMiddleware, isAdmin, menuController.updateMenuProduct);

module.exports = router;
