const router = require("express").Router();
const { getHomeData, getCategoryData ,getProductDetails} = require("../controllers/client");

router.get("/client/home", getHomeData);

router.get("/client/product/category/:id", getCategoryData);

router.get("/client/product/details/:id",getProductDetails)

module.exports = router;
