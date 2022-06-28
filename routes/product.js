const route=require("express").Router()

route.get("/product/add",(req,res)=>{
    res.render("AddProduct")
})


module.exports=route;