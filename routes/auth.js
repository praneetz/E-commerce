const route=require("express").Router();
const {createUser}=require("../auth/index")
const passport=require("passport")

route.get("/register",(req,res)=>{
    res.render("Register")
})

route.get("/login",async(req,res)=>{
    res.render("Login")
})

route.post("/login",passport.authenticate('local', { failureRedirect: '/login' }))

route.post("/register",createUser)


module.exports=route