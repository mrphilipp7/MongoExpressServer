const express = require("express");
const router = express.Router();
const { addReview } = require("../controllers/reviewController");
const validateToken = require("../middleware/validateTokenHandler");

router.post("/leaveReview", validateToken, addReview);

module.exports = router;
