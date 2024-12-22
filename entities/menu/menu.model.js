const mongoose = require("mongoose");

const variationSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  priceHot: {
    type: Number,
  },
  priceIced: {
    type: Number,
  },
});

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: function () {
      return !this.isDrink; // Price is required only when the item is not a drink
    },
  },
  image: {
    data: Buffer,
    type: String,
    required: true,
  },
  category: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  isDrink: {
    type: Boolean,
    required: true,
  },
  drinkType: {
    type: String,
    required: function () {
      return this.isDrink; // Drink type is required only if it is a drink
    },
  },
  variations: {
    type: [variationSchema],
    validate: {
      validator: function (variations) {
        // Ensure variations are present for drinks and empty for non-drinks
        if (this.isDrink) {
          return variations && variations.length > 0; // Variations must exist for drink items
        }
      },
      message: "Variations are only allowed for drink items.",
    },
  },
});

module.exports = mongoose.model("Menu", menuSchema);
