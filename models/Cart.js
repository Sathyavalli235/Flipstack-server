const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: String,
  product: {
    id: Number,
    name: String,
    price: Number,
    originalPrice: Number,
    image: String,
    quantity: {
      type: Number,
      default: 1
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("AddToCart", cartSchema);
