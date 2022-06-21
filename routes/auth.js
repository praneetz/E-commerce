const route=require("express").Router();
const {createUser}=require("../auth/index")
route.get("/register",(req,res)=>{
    res.render("Register")
})
route.post("/register",createUser)


module.exports=route