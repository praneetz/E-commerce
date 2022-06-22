const route=require("express").Router();
const {createUser}=require("../auth/index")
const validateAuth=require("../models/validation/auth")
route.get("/register",(req,res)=>{
    res.render("Register")
})
route.post("/register",validateAuth,createUser)


module.exports=route