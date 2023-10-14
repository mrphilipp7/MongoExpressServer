const express = require("express");
const router = express.Router();
const Book = require("../models/booksModel");
const {
  createBook,
  getAllBooks,
  getBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const validateToken = require("../middleware/validateTokenHandler");

router.get("/all", validateToken, getAllBooks);

router.get("/", validateToken, getBook);

router.post("/", validateToken, createBook);

router.put("/", validateToken, updateBook);

router.delete("/", validateToken, deleteBook);

module.exports = router;
