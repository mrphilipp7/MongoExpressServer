const express = require("express");
const router = express.Router();
const {
  addProduct,
  getProduct,
  getAllProducts,
  getProductsByCategory,
} = require("../controllers/productController");
const validateToken = require("../middleware/validateTokenHandler");

router.post("/addProduct", validateToken, addProduct);

router.get("/getProduct", validateToken, getProduct);

router.get("/getAllProducts", validateToken, getAllProducts);

router.get("/getProductsByCategory", validateToken, getProductsByCategory);

module.exports = router;