const express = require("express");
const router = express.Router();
const categoryController = require("./category.controller");

router.post("/", categoryController.addCategory);
router.get("/", categoryController.getCategories);
router.put("/:id", categoryController.editCategory);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;
