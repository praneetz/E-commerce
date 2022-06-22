const localStrategy=require("passport-local").Strategy
const passport=require("passport")

passport.use(new localStrategy(async function(email,password,done){
   try{
    console.log(email , password)

   }catch(err){
    console.log(err)
   }
}))
passport.serializeUser(function(user,done){})
passport.deserializeUser(function(id,done){})