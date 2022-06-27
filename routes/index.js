const route=require("express").Router()
const authRoute=require("./auth")
const categoryRoute=require("./category")

route.use(authRoute)
route.use(categoryRoute)

module.exports=route