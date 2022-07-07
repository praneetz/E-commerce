const route=require("express").Router()
const {addProductP1,getProduct,editProduct,updateProduct,deleteImg,uploadImage,createSize,addProductP2,createStorage,addElecProductP2}=require("../controllers/product")
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
    categoryList=categoryList.filter((d)=>d.subCategory==null)
    res.render("AddProductP1",{categoryList})
})


route.post("/product/add",addProductP1)
route.post("/product/add/p2",addProductP2)
route.post("/product/add/elec/p2",addElecProductP2)

route.get("/product/edit/:id",editProduct);

route.post("/product/edit/:id",updateProduct)

route.get("/product/list",getProduct)

route.get("/product/edit/image/delete/:id/:img",deleteImg);
route.post("/product/edit/image/upload/:id",upload,uploadImage);



// Size Route>>>>>>>>>>
route.post("/add/size",createSize)

// Storage Route>>>>>>
route.post("/add/storage",createStorage);

module.exports=route;