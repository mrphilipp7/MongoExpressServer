const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  currentUser,
  userById,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateTokenHandler");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);

router.get("/getUserById", validateToken, userById);

module.exports = router;
