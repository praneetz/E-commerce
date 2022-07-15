exports.createCategoryList = (list) => {
  let listItem = (list, subCategory = null) => {
    const catList = [];
    let theList;
    if (subCategory == null)
      theList = list.filter((d) => d.subCategory === null);
    else theList = list.filter((d) => d.subCategory == subCategory.toString());
    for (li of theList) {
      catList.push({
        _id: li._id,
        categoryName: li.categoryName,
        children: listItem(list, li._id),
      });
    }
    return catList;
  };
  return listItem(list);
};

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

exports.getModalNameByProductId = async (id) => {
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
};


exports.getModalNameByCategoryId=async(id)=>{
    try{
        let categoryDeatils=await category.findById(id).populate("subCategory")
        if(!categoryDeatils.subCategory)
        return "nf"
        switch(categoryDeatils.subCategory.categoryName){
          case"ELECTRONICS":
          return "e"
          case"MEN":
          return "f"
          case"WOMEN":
          return "f"
          default:
          return "nf"
        }

    }catch(err){
        console.log(err)
    }
}