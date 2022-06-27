const route=require("express").Router()
const {addCategory,getCategory}=require("../controllers/category")
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



module.exports=route