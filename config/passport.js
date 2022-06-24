const localStrategy = require("passport-local").Strategy;
const passport = require("passport");
const auth = require("../models/auth");
const bcrypt = require("bcrypt");

passport.use(
  new localStrategy(async function (email, password, done) {
    try {
      const isUser = await auth.findOne({ email });
      if (!isUser) return done(null, false);
      const isValidPassword = await bcrypt.compare(password, isUser.password);
      if (!isValidPassword) return done(null, false,{message:"password not matched!"});
      const { _id, firstName, lastName, mobile } = isUser;
      return done(null, { _id, firstName, lastName, email, mobile });
    } catch (err) {
      console.log(err);
      return done(err, false);
    }
  })
);
passport.serializeUser(function (user, done) {
  done(null, user._id);
});
passport.deserializeUser(async function (id, done) {
  const user = await auth.findById(id);
  const { _id, firstName, lastName, mobile } = user;
  done(null, { _id, firstName, lastName, mobile });
});
