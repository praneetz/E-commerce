const route = require("express").Router();
const { createUser,resetLink,resetPassword,changePassword } = require("../auth");
const passport = require("passport");

route.get("/register", (req, res) => {
  res.render("Register");
});

route.get("/login", async (req, res) => {
  res.render("Login");
});

route.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);

route.get("/login/err",async(req,res)=>{
  try{
    console.log("Here!")
    console.log(req)
  }
  catch(err){

  }
})

route.post("/register", createUser);

route.get("/recover/password",async(req,res)=>res.render("PasswordRecover"))



route.post("/recover/password",resetLink)


route.get("/reset-password/:token",resetPassword)
route.post("/reset-password/:token",changePassword)

module.exports = route;
