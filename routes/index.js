const route=require("express").Router()
const authRoute=require("./auth")
const categoryRoute=require("./category")
const productRoute=require("./product")

route.use(authRoute)
route.use(categoryRoute)
route.use(productRoute)

module.exports=route