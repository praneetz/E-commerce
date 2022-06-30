const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: "category",
  },
  desc: {
    type: String,
    required: true,
  },
  sortDesc: {
    type: String,
    required: true,
  },
  images: [],
});

const productModal=mongoose.model("product",productSchema);

module.exports=productModal;