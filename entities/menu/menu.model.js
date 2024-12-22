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
      return !this.isDrink;
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
      return this.isDrink;
    },
  },
  variations: {
    type: [variationSchema],
    validate: {
      validator: function (variations) {
        if (this.isDrink) {
          return variations && variations.length > 0;
        }
      },
      message: "Variations are only allowed for drink items.",
    },
  },
});

module.exports = mongoose.model("Menu", menuSchema);
