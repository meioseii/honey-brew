const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Menu" },
        quantity: Number,
        name: String,
        price: Number,
        size: { type: String, default: null },
        brewType: { type: String, enum: ["Hot", "Iced"], default: null },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    modifiedOn: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
