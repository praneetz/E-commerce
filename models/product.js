const mongoose = require("mongoose");
const sizeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
  },
});
const storageSchema = new mongoose.Schema({
  ram: {
    type: String,
    required: true,
    uppercase: true,
  },
  rom: {
    type: String,
    required: true,
    uppercase: true,
  },
});

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
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

const fashionsSchema = new mongoose.Schema({
  ...productSchema.obj,
  size: [
    {
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      size: {
        type: mongoose.Types.ObjectId,
        ref: "size",
      },
    },
  ],
});

const electronics = new mongoose.Schema({
  ...productSchema.obj,
  isStorable: {
    type: Boolean,
    default: false,
  },
  warranty: {
    type: Number,
  },
});
const nonStorableSchema = new mongoose.Schema({
  ...electronics.obj,
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const storableSchema = new mongoose.Schema({
  ...electronics.obj,
  storage: [
    {
      storage: {
        type: mongoose.Types.ObjectId,
        ref: "storage",
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const productModal = mongoose.model("product", productSchema);
const nonStorableProduct = mongoose.model(
  "nonStorableProduct",
  nonStorableSchema
);
const storableProduct = mongoose.model("storableProduct", storableSchema);
const fashionProduct = mongoose.model("fashinproduct", fashionsSchema);
const sizeModal = mongoose.model("size", sizeSchema);
const storageModal = mongoose.model("storage", storageSchema);

module.exports = {
  productModal,
  sizeModal,
  fashionProduct,
  storageModal,
  nonStorableProduct,
  storableProduct,
};
