const { default: mongoose } = require("mongoose");
const category = require("../models/category");
const {createCategoryList}=require("./functions")

exports.addCategory = async (req, res) => {
  try {
    let list = await category.getAllCategory();
    list = list.filter((li) => li.subCategory == null);
    let { catName: categoryName, subCat: subCategory } = req.body;
    categoryName = categoryName.toUpperCase();
    const isExist = await category.findOne({ categoryName });
    
    if (isExist)
      return res.render("AddCategory", {
        err: `${categoryName} category already Exist`,
        list,
      });
    let newCategory;
    if (!subCategory) newCategory = new category({ categoryName });
    else newCategory = new category({ categoryName, subCategory });
    await newCategory.save();

    return res.render("AddCategory", {
      success: `${categoryName} category Added`,
      list,
    });
  } catch (err) {
    console.log(err);

    let list = await category.getAllCategory();
    list = list.filter((li) => li.subCategory == null);
    return res.render("AddCategory", { err: `Something went wrong`, list });
  }
};

exports.getCategory = async (req, res) => {
  try {
    let list = await category.find({}).select(["-createdAt", "-updatedAt"]);
    res.render("AdminCategoryList", { list });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await category.findByIdAndDelete(req.params.id);
    res.redirect("/category/list");
  } catch (err) {
    console.log(err);
    res.redirect("/category/list");
  }
};
exports.updateCategory = async (req, res) => {
  try {
    let { catName: categoryName, subCat: subCategory } = req.body;
    categoryName = categoryName.toUpperCase();
    if (!subCategory)
      await category.findByIdAndUpdate(req.params.id, {
        categoryName,
        subCategory: null,
      });
    else
      await category.findByIdAndUpdate(req.params.id, {
        categoryName,
        subCategory,
      });
    res.redirect(req._parsedOriginalUrl.pathname);
  } catch (err) {
    console.log(err);
    res.redirect(req._parsedOriginalUrl.pathname);
  }
};

exports.demoData=async(req,res)=>{
  let list = await category.find({}).select(["-createdAt", "-updatedAt"]);
  list=createCategoryList(list, subCategory = null)
  res.json(list)
}



