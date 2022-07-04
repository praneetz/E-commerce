const route=require("express").Router()
const authRoute=require("./auth")
const categoryRoute=require("./category")
const productRoute=require("./product")
const clientRoute=require("./client")

route.use(authRoute)
route.use(categoryRoute)
route.use(productRoute)
route.use(clientRoute)

module.exports=route