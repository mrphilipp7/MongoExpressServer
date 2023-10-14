const express = require("express");
const router = express.Router();
const { addProduct, getProduct } = require("../controllers/productController");
const validateToken = require("../middleware/validateTokenHandler");

router.post("/addProduct", validateToken, addProduct);

router.get("/getProduct", validateToken, getProduct);

module.exports = router;
