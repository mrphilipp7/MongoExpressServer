const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is needed"],
      ref: "User",
    },
    title: { type: String, required: true },
    pages: { type: Number, required: true },
    author: { type: String, required: true },
    releaseDate: { type: Date, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
