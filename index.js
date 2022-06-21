const express = require("express");
const ejs=require("ejs")
const path=require("path")

require("./config/database");

const app = express();
const port = process.env.PORT || 3090;

app.use(express.static(path.join(__dirname,"public")));

app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")

app.get("/", (req, res) => res.render("Home"));
app.get("/register",(req,res)=>{
    res.render("Register")
})

app.listen(port, () =>
  console.log(`app is running on http://localhost:${port}`)
);
