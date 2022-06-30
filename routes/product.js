const route=require("express").Router()
const {addProduct,getProduct,editProduct,updateProduct,deleteImg,uploadImage}=require("../controllers/product")
const category=require("../models/category")
const multer=require("multer")
const path=require("path")
const uploadPath=path.join(__dirname,"../public/productImages")
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log("here")
        const mimetype = file.mimetype;
        const mimetype_splitted = mimetype.split("/");
        console.log(mimetype_splitted);
        const uuid = require("uuid").v4() + file.originalname;
        const name = uuid;
        file.originalname = name;
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + file.originalname); 
    }
    });
    
    const upload = multer({storage : storage}).array("images");

route.get("/product/add",async(req,res)=>{
    let categoryList=await category.getAllCategory()
    categoryList=categoryList.filter((d)=>d.subCategory!=null)
    res.render("AddProduct",{categoryList})
})

route.post("/product/add",upload,addProduct)

route.get("/product/edit/:id",editProduct);

route.post("/product/edit/:id",updateProduct)

route.get("/product/list",getProduct)

route.get("/product/edit/image/delete/:id/:img",deleteImg);
route.post("/product/edit/image/upload/:id",upload,uploadImage);


module.exports=route;