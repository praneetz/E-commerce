const {
  productModal: product,
  sizeModal: size,
  fashionProduct,
  storageModal: storage,
  nonStorableProduct,
  storableProduct,
} = require("../models/product");
const category = require("../models/category");
const fs = require("fs");
const path = require("path");
exports.addProductP1 = async (req, res) => {
  try {
    const { productName, price, quantity } = req.body;
    const prevData = { productName, price, quantity };
    if (!req.body.category) {
      let categoryList = await category.getAllCategory();
      categoryList = categoryList.filter((d) => d.subCategory == null);
      return res.render("AddProduct", {
        err: "Category is required",
        categoryList,
      });
    }
    let subCategoryList = await category.find({
      subCategory: req.body.category,
    });
    const categoryDeatils = await category.findById(req.body.category);
    if (categoryDeatils.categoryName != "ELECTRONICS") {
      const sizeList = await size.find({});
      console.log(sizeList);
      return res.render("FashionProduct", {
        subCategoryList,
        productName: req.body.productName,
        sizeList,
        prevData,
      });
    }
    const storageList = await storage.find({});
    console.log(storageList);
    return res.render("ElectronicsProduct", {
      subCategoryList,
      productName: req.body.productName,
      storageList,
      prevData,
    });
  } catch (err) {
    console.log(err);
  }
  // try {
  //   const { productName, price, quantity, category, desc, sortDesc } = req.body;
  //   if (!productName || !price || !quantity || !category || !desc || !sortDesc){
  //     deleteImageFromStorage(images)
  //     return res.render("AddProduct", { err: "All Field is required" });}
  //   const newProduct = new product({ ...req.body, images });
  //   const isAdded = await newProduct.save();
  //   if (!isAdded){
  //     deleteImageFromStorage(images)
  //     return res.render("AddProduct", { err: "Something went wrong!" });
  //   }
  //   return res.render("AddProduct", { success: "Product Added" });
  // } catch (err) {
  //   console.log(err)
  //   deleteImageFromStorage(images)
  //   return res.render("AddProduct", { err: "Something went wrong!" });
  // }
};

exports.addProductP2 = async (req, res) => {
  try {
    const { productName, category, sortDesc, desc } = req.body;
    let sizeData = [];
    const sizeList = await size.find({});
    sizeList.map((s) => {
      if (req.body.hasOwnProperty(`size_${s.name}`)) {
        let quantity = req.body[`quantity_${s.name}`];
        let price = req.body[`price_${s.name}`];
        let sizes = req.body[`size_${s.name}`];
        const obj = {
          quantity,
          price,
          size: sizes,
        };
        sizeData.push(obj);
      }
    });

    console.log(
      new fashionProduct({
        productName,
        category,
        sortDesc,
        desc,
        size: sizeData,
      })
    );
  } catch (err) {
    console.log(err);
  }
};

exports.addElecProductP2 = async (req, res) => {
  try {
    const { productName, category, sortDesc, desc, isStorable, warranty } =
      req.body;
    console.log(req.body);
    if (!isStorable) {
      const { price, quantity } = req.body;
      console.log(
        new nonStorableProduct({
          productName,
          category,
          sortDesc,
          desc,
          price,
          quantity,
          warranty,
        })
      );
      return console.log("Not Storable");
    }
    const storageList = await storage.find({});
    console.log(storageList);
    let storageData = [];
    storageList.map((strg) => {
      if (req.body.hasOwnProperty(`storage_${strg.ram}_${strg.rom}`)) {
        let storage = req.body[`storage_${strg.ram}_${strg.rom}`];
        let price = req.body[`price_${strg.ram}_${strg.rom}`];
        let quantity = req.body[`quantity_${strg.ram}_${strg.rom}`];
        const obj = {
          storage,
          price,
          quantity,
        };
        storageData.push(obj);
      }
    });
    const newStorableProduct = new storableProduct({
      productName,
      category,
      sortDesc,
      desc,
      warranty,
      isStorable: true,
      storage: storageData,
    });
    return console.log(" Storable");
  } catch (err) {
    console.log(err);
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
  if (imgs.length > 0) {
    imgs.map((imagePath) => {
      fs.unlinkSync(
        path.join(__dirname, `../public/productImages/${imagePath}`)
      );
    });
  }
}

// Size>>>>>>>>>>>>>>>
exports.createSize = async (req, res) => {
  try {
    let { size: name } = req.body;
    if (!name) return res.status(400).json({ msg: "Size is required" });
    name = name.toUpperCase();
    const isExist = await size.findOne({ name });
    if (isExist)
      return res.status(400).json({ msg: `${name} Size already Exist` });
    const newSize = new size({ name });
    const isAdded = await newSize.save();
    if (!isAdded) return res.status(400).json({ msg: `Something went wrong!` });
    return res.status(200).json({ msg: `${name} Size Added!` });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ msg: `Something went wrong!` });
  }
};

// Storage>>>>>>>>>
exports.createStorage = async (req, res) => {
  try {
    const { ram, rom } = req.body;
    if (!ram || !rom) return res.status(400).send("All field is required!");
    const isExist = await storage.findOne({ ram, rom });
    if (isExist)
      return res.status(400).send(`Storage ${ram}| ${rom} already Exist!`);
    const newStorage = new storage({ ram, rom });
    if (!newStorage) return res.status(400).send("Something went wrong!");
    await newStorage.save();
    return res.status(200).send(`Storage ${ram}| ${rom} Added!`);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Something went wrong!");
  }
};
