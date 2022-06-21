const express = require("express");
const ejs=require("ejs")
const path=require("path")
const authRoute=require("./routes/auth")

require("./config/database");

const app = express();
const port = process.env.PORT || 3090;

app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")));
app.use(authRoute)


app.get("/", (req, res) => res.render("Home"));


app.listen(port, () =>
  console.log(`app is running on http://localhost:${port}`)
);
