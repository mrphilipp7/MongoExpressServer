const Book = require("../models/booksModel");
const mongoose = require("mongoose");

/**
 * @desc fetch all books
 * @route GET /books/all
 * @access private
 */
const getAllBooks = async (req, res) => {
  try {
    const book = await Book.find({}).sort({ createdAt: -1 });
    res.status(200).send(book);
  } catch (err) {
    res.status(400).send({ status: "failure", error: err.message });
  }
};

/**
 * @desc fetch a book
 * @route GET /books/
 * @access private
 */
const getBook = async (req, res) => {
  const { id } = req.query;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send({ status: "Invalid mongo id" });
  try {
    const book = await Book.findById(id);
    //error for empty search
    if (!book) return res.status(404).send({ status: "No book found" });
    res.status(200).send(book);
  } catch (err) {
    res.status(400).send({ status: "failure", error: err.message });
  }
};

/**
 * @desc create a new book
 * @route POST /books/
 * @access private
 */
const createBook = async (req, res) => {
  const { title, pages, author, releaseDate } = req.body;
  try {
    const book = await Book.create({
      title,
      pages,
      author,
      releaseDate,
      user_id: req.user.user.id,
    });
    res.status(200).send(book);
  } catch (err) {
    res.status(400).send({ status: "failure", error: err.message });
  }
};

/**
 * @desc update a book
 * @route PUT /books/
 * @access private
 */
const updateBook = async (req, res) => {
  const { id, title, pages, author } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404);
    throw new Error("Invalide MongoID");
  }

  try {
    const book = await Book.findOneAndUpdate(
      { _id: id },
      {
        //update body
        title: title,
        pages: pages,
        author: author,
        user_id: req.user.user.id,
      }
    );
    if (!book) {
      res.status(404);
      throw new Error("No book found");
    }
    res.status(200).send(book);
  } catch (err) {
    res.status(400);
    // .send({ status: "failure", error: err.message });
    throw new Error(err.message);
  }
};

/**
 * @desc delete a book
 * @route DELETE /books/
 * @access private
 */
const deleteBook = async (req, res) => {
  const { id } = req.query;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send({ status: "Invalid mongo id" });

  try {
    const book = await Book.findOneAndDelete({ _id: id });
    if (!book) return res.status(404).send({ status: "No book found" });
    res.status(200).send(book);
  } catch (err) {
    res.status(400).send({ status: "failure", error: err.message });
  }
};

module.exports = { createBook, getAllBooks, getBook, deleteBook, updateBook };
