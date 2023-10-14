const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const validatePriceFormat = (value) => {
  // Regular expression to make sure price is in USD format
  const regex =
    /^(?!0,?\d)(?:\d{1,3}(?:,\d{3})*(?:\.\d{2})?|\d{1,3}(?:\.\d{2})?|\d+(?:\.\d{2})?)$/;
  return regex.test(value);
};

const productSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "User ID is needed"],
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Please enter a title"],
      unique: true,
    },
    price: {
      type: Number,
      required: [true, "Please enter a price"],
      validate: {
        validator: validatePriceFormat,
        message: "Please make sure the price is a valid number.",
      },
    },
    category: {
      type: [String],
      required: [true, "Please enter 1 or more categories"],
    },
  },
  { timestamps: true }
);

// Mongoose middleware to convert category strings to lowercase before saving
productSchema.pre("save", function (next) {
  // Convert each category string to lowercase
  this.category = this.category.map((category) => category.toLowerCase());
  next();
});

module.exports = mongoose.model("Product", productSchema);
