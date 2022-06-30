const product = require("../models/product");
const category = require("../models/category");
const fs = require("fs");
const path = require("path");
exports.addProduct = async (req, res) => {
  let images = [];
  req.files.map((f) => {
    images.push(f.filename);
  });
  try {
    const { productName, price, quantity, category, desc, sortDesc } = req.body;
    if (!productName || !price || !quantity || !category || !desc || !sortDesc){
      deleteImageFromStorage(images)
      return res.render("AddProduct", { err: "All Field is required" });}
    const newProduct = new product({ ...req.body, images });
    const isAdded = await newProduct.save();
    if (!isAdded){
      deleteImageFromStorage(images)
      return res.render("AddProduct", { err: "Something went wrong!" });
    }
    return res.render("AddProduct", { success: "Product Added" });
  } catch (err) {
    console.log(err)
    deleteImageFromStorage(images)
    return res.render("AddProduct", { err: "Something went wrong!" });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const productList = await product.find({}).limit(5);
    console.log(productList);
    return res.render("ProductList", { list: productList });
  } catch (err) {
    console.log(err);
  }
};

exports.editProduct = async (req, res) => {
  try {
    let categoryList = await category.getAllCategory();
    categoryList = categoryList.filter((d) => d.subCategory != null);
    const productDetails = await product.findById(req.params.id);
    res.render("ProductEdit", { productDetails, categoryList });
  } catch (err) {
    console.log(err);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const isUpdated = await product.findByIdAndUpdate(req.params.id, req.body);
    if (!isUpdated) return res.redirect(req._parsedOriginalUrl.pathname);
    return res.redirect(req._parsedOriginalUrl.pathname);
  } catch (err) {
    console.log(err);
    return res.redirect(req._parsedOriginalUrl.pathname);
  }
};

exports.deleteImg = async (req, res) => {
  try {
    const { id, img } = req.params;
    const isProduct = await product.findByIdAndUpdate(id, {
      $pull: { images: img },
    });
    deleteImageFromStorage([img]);
    return res.redirect(`/product/edit/${id}`);
  } catch (err) {
    console.log(err);
    return res.redirect(`/product/edit/${id}`);
  }
};

exports.uploadImage = async (req, res) => {
  let images = [];
  req.files.map((f) => {
    images.push(f.filename);
  });
  try {
    const isUpdated = await product.findByIdAndUpdate(req.params.id, {
      $push: { images: { $each: images } },
    });
    if (!isUpdated) {
      deleteImageFromStorage(images);
      return res.redirect(`/product/edit/${req.params.id}`);
    }
    return res.redirect(`/product/edit/${req.params.id}`);
  } catch (err) {
    console.log(err);
    deleteImageFromStorage(images);
    return res.redirect(`/product/edit/${req.params.id}`);
  }
};

function deleteImageFromStorage(imgs) {
  if(imgs.length>0){
  imgs.map((imagePath) => {
    fs.unlinkSync(path.join(__dirname, `../public/productImages/${imagePath}`));
  });}
}
