const Product = require("../models/productModel");
const Review = require("../models/reviewModel");

const handleErrors = (err) => {
  let errors = { title: "", price: "", rating: "", category: "" };

  // duplicate title error
  if (err.code === 11000) {
    errors.title = "A product with this title already exists";
    return errors;
  }

  // validation errors
  if (err.message.includes("Product validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const getReviewsForProduct = async (productId) => {
  try {
    // Search for reviews with the given product id in the 'reviews' collection
    const reviews = await Review.find({ product_id: productId });
    return reviews;
  } catch (error) {
    // Handle errors if any
    console.error(error);
    throw new Error("Error fetching reviews for the product.");
  }
};

/**
 * @desc make new product
 * @route POST api/product/addProduct
 * @access private
 */
const addProduct = async (req, res) => {
  const { title, price, category } = req.body.params;
  try {
    //create product
    const newProduct = await Product.create({
      title,
      price,
      category,
      user_id: req.user.user.id,
    });
    console.log("Created a new product");
    res.status(201).send(newProduct);
  } catch (err) {
    //catch mongoose errs pertaining to model
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

/**
 * @desc get product details including reviews
 * @route POST api/product/getProduct
 * @access private
 */
const getProduct = async (req, res) => {
  // const { title } = req.body;
  // <- use w thunder, req.query w axios
  const { title } = req.query;

  try {
    // Search for a product with the given title in the 'products' collection
    const product = await Product.findOne({ title: title });

    if (!product) {
      // If no product with the given title is found, return an error response
      return res
        .status(404)
        .json({ error: "Product not found with the provided title." });
    }

    // Get reviews for the found product by its _id
    const reviews = await getReviewsForProduct(product._id);

    // Respond with the product and its reviews
    res.status(200).json({ product, reviews });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * @desc get all products
 * @route GET api/product/getAllProducts
 * @access private
 */
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ title: -1 });
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * @desc grab all products that contain a certain category
 * @route GET api/product/getProductsByCategory
 * @access private
 */
const getProductsByCategory = async (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ error: "No category was supplied" });
  }

  try {
    const products = await Product.find({
      category: { $in: [category.toLowerCase()] },
    });
    if (!products) {
      // If no product with the given title is found, return an error response
      return res
        .status(404)
        .json({ error: "No products with that category exist" });
    }
    res.status(200).send({ products });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  addProduct,
  getProduct,
  getAllProducts,
  getProductsByCategory,
};