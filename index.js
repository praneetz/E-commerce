const express = require("express");
const ejs=require("ejs")
const path=require("path")
const route=require("./routes")
const passport=require("passport")
const expressSession=require("express-session")
require("./config/database");
require("./config/passport")

const app = express();
const port = process.env.PORT || 3090;

app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")));
app.use(expressSession({secret:"secret",resave:false,saveUninitialized:false}))
app.use(passport.initialize())
app.use(passport.session())
app.use(route)



app.get("/", (req, res) => {
  console.log(req.user)
  res.render("AdminDashboard")
  
});

app.get("*",(req,res)=>res.render("404"))


app.listen(port, () =>
  console.log(`app is running on http://localhost:${port}`)
);
