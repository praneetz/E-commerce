const route=require("express").Router()
const {addCategory,getCategory,deleteCategory,updateCategory,demoData}=require("../controllers/category")
const category=require("../models/category")

route.get("/dashboard",(req,res)=>{
    res.render("AdminDashboard")
})

route.get("/category/list",getCategory)

route.get("/category/create", async(req, res) => {
  let list=await category.getAllCategory()
  list=list.filter((li)=>li.subCategory==null)
  res.render("AddCategory",{list})
});

route.post("/category/create",addCategory)

route.get("/category/delete/:id",deleteCategory)

route.get("/category/update/:id",async(req,res)=>{
  const catDetails=await category.findById(req.params.id).select(["-createdAt","-updatedAt","-__v"]);
  let list=await category.getAllCategory()
  list=list.filter((li)=>li.subCategory==null)
  res.render("UpdateCategory",{catDetails,list})
})

route.post('/category/update/:id',updateCategory)


route.get("/getData",demoData)
module.exports=route