const express = require("express");

require("./database");

const app = express();
const port = process.env.PORT || 3090;

app.get("/", (req, res) => res.send("E-Commerce Website!"));

app.listen(port, () =>
  console.log(`app is running on http://localhost:${port}`)
);
