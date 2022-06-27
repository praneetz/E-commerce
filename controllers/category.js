const { default: mongoose } = require("mongoose");
const category = require("../models/category");

exports.addCategory = async (req, res) => {
  try {
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

    let list = await category.getAllCategory();
    list = list.filter((li) => li.subCategory == null);
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
    // console.log(list.filter((fl)=>fl.subCategory=="62b95a9a208500a11ddca370"))
    list = createCategoryList(list);
    // return res.json(list)
    res.render("AdminCategoryList", { list });
  } catch (err) {
    console.log(err);
  }
};

function createCategoryList(list, subCategory = null) {
  const catList = [];
  let theList;
  if (subCategory == null) theList = list.filter((d) => d.subCategory === null);
  else theList = list.filter((d) => d.subCategory == subCategory.toString());
  for (li of theList) {
    catList.push({
      _id: li._id,
      categoryName: li.categoryName,
      children: createCategoryList(list, li._id),
    });
  }
  return catList;
}
