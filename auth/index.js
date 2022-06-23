const auth = require("../models/auth");
const { validateAuth } = require("../models/validation/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt=require("bcrypt")

exports.createUser = async (req, res) => {
  try {
    console.log(req.body);
    const { error } = validateAuth(req.body);
    if (error) {
      let ErrorData = [];
      error.details.map((er) => {
        let splitedError = er.message.split(`"`);
        ErrorData.push(`${splitedError[1]}${splitedError[2]}`);
      });
      return res.status(400).json({ message: ErrorData });
    }

    const isEmailExist = await auth.findOne({ email: req.body.email });
    const isPhoneExist = await auth.findOne({ mobile: req.body.mobile });
    if (isEmailExist || isPhoneExist)
      return res.status(400).json({
        message: "Already existing user with given email and mobile number",
      });
    const newAuth = new auth(req.body);
    const isCreated = await newAuth.save();
    if (!isCreated)
      return res.status(400).json({ message: "Something went wrong" });
    return res.status(200).json({ message: "Register Successfull!" });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Something went wrong" });
  }
};

exports.restLink = async (req, res) => {
  try {
    const { email } = req.body;
    const isExistingUser = await auth.findOne({ email });
    if (!isExistingUser)
      return res.render("PasswordRecover", { errorMsg: "email does'nt exist" });
    const resetLink = await jwt.sign(
      { _id: isExistingUser._id },
      process.env.PASSWORD_RESET_KEY
    );
    if (!resetLink)
      return res.render("PasswordRecover", {
        errorMsg: "Something went wrong try agin",
      });

    console.log(`http://localhost:3090/reset-password/${resetLink}`);
    return res.render("PasswordRecover", {
      successMsg: `Reset Link sent to your email ${email}`,
    });
  } catch (err) {
    console.log(err);
    return res.render("PasswordRecover", {
      errorMsg: "Something went wrong try agin",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const isValidToken = await jwt.verify(
      token,
      process.env.PASSWORD_RESET_KEY
    );
    if (!isValidToken) return res.render("404");
    return res.render("ChangePassword");
  } catch (err) {
    console.log(err);
    return res.render("404");
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password1, password2 } = req.body;
    if(password1!=password2)
    return res.render("ChangePassword",{errorMsg:"Password does'nt match"})
    const isValidToken=await jwt.verify(token,process.env.PASSWORD_RESET_KEY)
    if(!isValidToken)
    return res.render("ChangePassword",{errorMsg:"Something Went Wrong"})
    const salt=await bcrypt.genSalt()
    const newPassword=await bcrypt.hash(password1,salt)
    const user=await auth.findByIdAndUpdate(isValidToken._id,{password:newPassword},{new:true})
    if(!user) 
    return res.render("ChangePassword",{errorMsg:"Something Went Wrong"})
    return res.redirect("/login")
  } catch (err) {
    console.log(err);
    return res.render("ChangePassword",{errorMsg:"Something Went Wrong"})
  }
};
