const category=require("../models/category")
const {productModal:product, nonStorableProduct,storableProduct, fashionProduct, nonFashionProduct}=require("../models/product")
const {createCategoryList}=require("./functions")
const {getModalNameByProductId,getModalNameByCategoryId}=require("./functions")

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
        let products=[];
        const modalName=await getModalNameByCategoryId(req.params.id)
        switch(modalName){
            case "e":
                products=await nonStorableProduct.find({category:req.params.id})
                if(products.length==0)
                products=await storableProduct.find({category:req.params.id}).populate("storage.storage")
                break;
            case "f":
                products=await fashionProduct.find({category:req.params.id}).populate("size.size")
                break;
            case "nf":
                products=await nonFashionProduct.find({category:req.params.id})
                break
        }
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
        let categoryItems=await category.getAllCategory()
        const categories=createCategoryList(categoryItems);
        let categoryChild=categoryItems.filter((d)=>d.subCategory!=null&&d.subCategory!="62bd3ac51b1b28e12fa97ffd")

        

        const productDetails=await product.findById(req.params.id)
        if(!req.user)
        return res.render("ProductDetails",{categories,categoryChild,product:productDetails})
        return res.render("ProductDetails",{categories,categoryChild,product:productDetails,user:req.user})

    }catch(err){
        console.log(err)
    }
}