const category=require("../models/category")
const product=require("../models/product")
const {createCategoryList}=require("./functions")
exports.getHomeData=async(req,res)=>{
    try{
        let categoryItems=await category.getAllCategory()
        const categories=createCategoryList(categoryItems);
        let categoryChild=categoryItems.filter((d)=>d.subCategory!=null&&d.subCategory!="62bd3ac51b1b28e12fa97ffd")
        if(!req.user)
        return res.render("clientHome",{categories,categoryChild})
        return res.render("clientHome",{categories,categoryChild,user:req.user})
        

    }catch(err){
        console.log(err)
    }
}

exports.getCategoryData=async(req,res)=>{
    try{
        let categoryItems=await category.getAllCategory()
        const categories=createCategoryList(categoryItems);
        let categoryChild=categoryItems.filter((d)=>d.subCategory!=null&&d.subCategory!="62bd3ac51b1b28e12fa97ffd")
        const products=await product.find({category:req.params.id})
        console.log(products)
        if(!req.user)
        return res.render("clientProduct",{categories,categoryChild,products})
        return res.render("clientProduct",{categories,categoryChild,user:req.user,products})

    }catch(err){
        console.log(err)
    }
}


exports.getProductDetails=async(req,res)=>{
    try{
        const productDetails=await product.findById(req.params.id)
        console.log(productDetails)
        return res.redirect("/")
        return res.redirect("/")

    }catch(err){
        console.log(err)
    }
}