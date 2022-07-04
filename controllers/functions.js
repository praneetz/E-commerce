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
