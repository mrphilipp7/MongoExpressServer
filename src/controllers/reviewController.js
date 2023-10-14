const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

const handleErrors = (err) => {
  let errors = { review: "", rating: "" };

  // validation errors
  if (err.message.includes("Review validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

/**
 * @desc make new review on a product
 * @route POST api/review/leaveReview
 * @access private
 */
const addReview = async (req, res) => {
  const { title, review, rating } = req.body;

  try {
    // Search for a product with the given title in the 'products' collection
    const product = await Product.findOne({ title: title });

    if (!product) {
      // If no product with the given title is found, return an error response
      return res
        .status(404)
        .json({ error: "Product not found with the provided title." });
    }
    const product_id = product._id;
    //create product
    const newReview = await Review.create({
      product_id: product_id,
      user_id: req.user.user.id,
      review,
      rating,
    });
    console.log(`Created a new review for the product ${product.title}`);
    res.status(201).send(newReview);
  } catch (err) {
    //catch mongoose errs pertaining to model
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports = { addReview };
