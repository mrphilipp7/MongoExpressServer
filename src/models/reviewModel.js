const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const isValidRating = (value) => {
  // Regular expression to make sure rating can only be between 1 and 5 only ints
  const regex = /^[1-5]$/;
  return regex.test(value.toString());
};

const reviewSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is needed"],
      ref: "User",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Product ID is needed"],
      ref: "Product",
    },
    review: {
      type: String,
      required: [true, "Please enter a review"],
    },
    rating: {
      type: Number,
      required: [true, "Please enter a rating"],
      validate: {
        validator: isValidRating,
        message: "Please make sure the rating is a valid format (1-5).",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
