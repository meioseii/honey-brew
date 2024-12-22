const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const { authMiddleware } = require("../../middleware/authMiddleware");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/", authMiddleware, userController.getUserProfile);
router.put("/", authMiddleware, userController.updateUserProfile);

module.exports = router;
