const {
  productModal: product,
  sizeModal: size,
  fashionProduct,
  storageModal: storage,
  nonStorableProduct,
  storableProduct,
  nonFashionProduct,
} = require("../models/product");
const category = require("../models/category");
const fs = require("fs");
const path = require("path");
exports.addProductP1 = async (req, res) => {
  try {
    console.log(req.body);
    const { productName } = req.body;
    const prevData = { productName };
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
      if (
        categoryDeatils.categoryName == "MEN" ||
        categoryDeatils.categoryName == "WOMEN"
      ) {
        const sizeList = await size.find({});
        return res.render("FashionProduct", {
          subCategoryList,
          productName: req.body.productName,
          sizeList,
          prevData,
        });
      }
      subCategoryList.length == 0;
      subCategoryList = await category.find({ _id: req.body.category });
      return res.render("NonFashionProduct", {
        subCategoryList,
        productName: req.body.productName,
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
exports.addNonFashionP2 = async (req, res) => {
  let images = getImageData(req.files);
  try {
    const bodyData = JSON.parse(JSON.stringify(req.body));
    const { productName, desc, sortDesc, quantity, price } = bodyData;
    if ((!productName, !desc, !sortDesc, !quantity, !price)) {
      deleteImageFromStorage(images);
      return res.redirect("/product/add?err=Something went wrong try again!");
    }
    const newNonFashionProduct = new nonFashionProduct({ ...bodyData, images });
    const isSaved = await newNonFashionProduct.save();
    if (!isSaved) {
      deleteImageFromStorage(images);
      return res.redirect("/product/add?err=Something went wrong try again!");
    }
    return res.redirect(`/product/add?success=${productName} Added!`);
  } catch (err) {
    console.log(err);
    deleteImageFromStorage(images);
    return res.redirect("/product/add?err=Something went wrong try again!");
  }
};

exports.addProductP2 = async (req, res) => {
  let images = getImageData(req.files);
  try {
    const { productName, category, sortDesc, desc } = req.body;
    const bodyData = JSON.parse(JSON.stringify(req.body));
    let sizeData = [];
    const sizeList = await size.find({});
    sizeList.map((s) => {
      if (bodyData.hasOwnProperty(`size_${s.name}`)) {
        let quantity = bodyData[`quantity_${s.name}`];
        let price = bodyData[`price_${s.name}`];
        let sizes = bodyData[`size_${s.name}`];
        const obj = {
          quantity,
          price,
          size: sizes,
        };
        sizeData.push(obj);
      }
    });

    const newFashionProduct = new fashionProduct({
      productName,
      category,
      sortDesc,
      desc,
      size: sizeData,
      images,
    });
    const isSaved = await newFashionProduct.save();
    if (!isSaved) {
      deleteImageFromStorage(images);
      return res.redirect("/product/add?err=Something went wrong try again!");
    }
    return res.redirect(`/product/add?success=${productName} Added!`);
  } catch (err) {
    console.log(err);
    deleteImageFromStorage(images);
    return res.redirect("/product/add?err=Something went wrong try again!");
  }
};

exports.addElecProductP2 = async (req, res) => {
  let images = getImageData(req.files);
  try {
    const {
      productName,
      category: cat,
      sortDesc,
      desc,
      isStorable,
      warranty,
    } = req.body;
    const bodyData = JSON.parse(JSON.stringify(req.body));
    if (!isStorable) {
      const { price, quantity } = req.body;
      const newNonStorableProduct = new nonStorableProduct({
        productName,
        category: cat,
        sortDesc,
        desc,
        price,
        quantity,
        warranty,
        images,
      });
      const isAddedNonStorableProduct = await newNonStorableProduct.save();
      if (!isAddedNonStorableProduct) {
        deleteImageFromStorage(images);
        return res.redirect("/product/add?err=Something went wrong try again!");
      }
      return res.redirect(`/product/add?success=${productName} Added!`);
    }
    const storageList = await storage.find({});
    let storageData = [];
    storageList.map((strg) => {
      if (bodyData.hasOwnProperty(`storage_${strg.ram}_${strg.rom}`)) {
        let storage = bodyData[`storage_${strg.ram}_${strg.rom}`];
        let price = bodyData[`price_${strg.ram}_${strg.rom}`];
        let quantity = bodyData[`quantity_${strg.ram}_${strg.rom}`];
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
      category: cat,
      sortDesc,
      desc,
      warranty,
      isStorable: true,
      storage: storageData,
      images,
    });
    const isAddedStorableProduct = await newStorableProduct.save();
    if (!isAddedStorableProduct) {
      deleteImageFromStorage(images);
      return res.redirect("/product/add?err=Something went wrong try again!");
    }
    return res.redirect(`/product/add?success=${productName} Added!`);
  } catch (err) {
    console.log(err);
    deleteImageFromStorage(images);
    return res.redirect("/product/add?err=Something went wrong try again!");
  }
};

exports.getProduct = async (req, res) => {
  try {
    // console.log(req.query)
    // const productList = await product.find({}).limit(5);
    const storableProductList = await storableProduct.find({});
    const nonStorableProductList = await nonStorableProduct.find({});
    const fashionProductList = await fashionProduct.find({});
    const nonFashionProductList = await nonFashionProduct.find({});
    const productList = [
      ...storableProductList,
      ...nonStorableProductList,
      ...fashionProductList,
      ...nonFashionProductList,
    ];
    console.log(productList);
    return res.render("ProductList", { list: productList });
  } catch (err) {
    console.log(err);
  }
};

exports.editProduct = async (req, res) => {
  try {
    let categoryList = await category.getAllCategory();

    let modalName = await getModalNameByProductId(req.params.id);
    console.log(modalName);
    let productDetails = null;
    let cat = null;
    let subCatId = null;
    switch (modalName) {
      case "sp":
        productDetails = await storableProduct
          .findById(req.params.id)
          .populate("storage.storage");
        subCatId = await category.findById(productDetails.category);
        cat = await category.find({
          subCategory: subCatId.subCategory,
        });
        console.log(productDetails);
        res.render("ElectronicEditProduct", {
          productDetails,
          categoryList: cat,
          product: "sp",
        });
        break;
      case "nsp":
        productDetails = await nonStorableProduct.findById(req.params.id);
        subCatId = await category.findById(productDetails.category);
        cat = await category.find({
          subCategory: subCatId.subCategory,
        });
        console.log(productDetails);
        res.render("ElectronicEditProduct", {
          productDetails,
          categoryList: cat,
          product: "nsp",
        });
        break;
      case "fp":
        productDetails = await fashionProduct
          .findById(req.params.id)
          .populate("size.size");
        console.log(productDetails);
        subCatId = await category.findById(productDetails.category);
        cat = await category.find({
          subCategory: subCatId.subCategory,
        });
        res.render("NonFashionProductEdit", {
          productDetails,
          categoryList: cat,
          product: "fp",
        });
        break;
      case "nfp":
        productDetails = await nonFashionProduct.findById(req.params.id);
        subCatId = await category.findById(productDetails.category);
        if (subCatId.subCategory)
          cat = await category.find({
            subCategory: subCatId.subCategory,
          });
        else cat = [subCatId];
        res.render("NonFashionProductEdit", {
          productDetails,
          categoryList: cat,
          product: "nfp",
        });
        break;
      default:
        break;
    }
  } catch (err) {
    console.log(err);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    let { productName, category: cat, sortDesc, desc } = req.body;

    const modalName = await getModalNameByProductId(req.params.id);
    let isUpdated = null;
    switch (modalName) {
      case "sp":
        const storageList = await storage.find({});
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
        isUpdated = await storableProduct.findByIdAndUpdate(req.params.id, {
          productName,
          category: cat,
          sortDesc,
          desc,
          warranty: req.body.warranty,
          storage: storageData,
        });
        break;
      case "nsp":
        isUpdated = await nonStorableProduct.findByIdAndUpdate(req.params.id, {
          productName,
          category: cat,
          price: req.body.price,
          quantity: req.body.quantity,
          warranty: req.body.warranty,
          desc,
          sortDesc,
        });
        break;
      case "fp":
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

        isUpdated = await fashionProduct.findByIdAndUpdate(req.params.id, {
          productName,
          category: cat,
          sortDesc,
          desc,
          size: sizeData,
        });
        break;
      case "nfp":
        isUpdated = await nonFashionProduct.findByIdAndUpdate(
          req.params.id,
          req.body
        );
        break;
      default:
        break;
    }
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
    const modalName = await getModalNameByProductId(id);
    switch (modalName) {
      case "sp":
        await storableProduct.findByIdAndUpdate(id, { $pull: { images: img } });
        break;
      case "nsp":
        await nonStorableProduct.findByIdAndUpdate(id, {
          $pull: { images: img },
        });
        break;
      case "fp":
        await fashionProduct.findByIdAndUpdate(id, { $pull: { images: img } });
        break;
      case "nfp":
        await nonFashionProduct.findByIdAndUpdate(id, {
          $pull: { images: img },
        });
        break;
      default:
        break;
    }

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
    const modalName = await getModalNameByProductId(req.params.id);
    let isUpdated = null;
    switch (modalName) {
      case "sp":
        isUpdated = await storableProduct.findByIdAndUpdate(req.params.id, {
          $push: { images: { $each: images } },
        });
        break;
      case "nsp":
        isUpdated = await nonStorableProduct.findByIdAndUpdate(req.params.id, {
          $push: { images: { $each: images } },
        });
        break;
      case "fp":
        isUpdated = await fashionProduct.findByIdAndUpdate(req.params.id, {
          $push: { images: { $each: images } },
        });
        break;
      case "nfp":
        isUpdated = await nonFashionProduct.findByIdAndUpdate(req.params.id, {
          $push: { images: { $each: images } },
        });
        break;
      default:
        isUpdated = null;
        break;
    }
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

function getImageData(img) {
  let data = [];
  img.map((d) => {
    data.push(d.filename);
  });
  return data;
}

async function getModalNameByProductId(id) {
  let productDetails = null;
  if (!productDetails) {
    productDetails = await storableProduct.findById(id);
    if (productDetails) return "sp";
  }
  if (!productDetails) {
    productDetails = await nonStorableProduct.findById(id);
    if (productDetails) return "nsp";
  }
  if (!productDetails) {
    productDetails = await fashionProduct.findById(id);
    if (productDetails) return "fp";
  }
  if (!productDetails) {
    productDetails = await nonFashionProduct.findById(id);
    if (productDetails) return "nfp";
  }
  return null;
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
