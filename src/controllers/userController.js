const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
  let errors = { email: "", password: "", username: "" };

  // duplicate email error
  if (err.code === 11000) {
    errors.email = "that email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

/**
 * @desc make new user
 * @route POST api/user/register
 * @access public
 */
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    //create user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    console.log("Successfully created a new user");
    res.status(201).send(newUser);
  } catch (err) {
    //catch mongoose errs pertaining to model
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

/**
 * @desc login a user
 * @route POST api/user/login
 * @access public
 */
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  //error handling to avoid null values where values are mandatory
  if (!email || !password) {
    res.status(400).json({ error: "All fields are required" });
  }

  const user = await User.findOne({ email });
  //compare password
  if (user && (await bcrypt.compare(password, user.password))) {
    const AccessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("AccessToken", AccessToken, {
      httpOnly: true,
      maxAge: 900000, // 15 min in milliseconds
    });

    const RefreshToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("RefreshToken", RefreshToken, {
      httpOnly: true,
      maxAge: 86400000, // 1 day in milliseconds
    });

    res.status(200).send({
      user: { id: user.id, email: user.email, username: user.username },
    });
  } else {
    res.status(401).json({ error: "Email or password is incorrect" });
  }
};

/**
 * @desc get user info
 * @route GET api/user/current
 * @access private
 */
const currentUser = async (req, res) => {
  // console.log(req);
  res.send({ user: req.user });
};

/**
 * @desc get user info by ID
 * @route GET api/user/getUserById
 * @access private
 */
const userById = async (req, res) => {
  const { id } = req.query;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "No book found" });
    res.status(200).send(user);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

module.exports = { registerUser, loginUser, currentUser, userById };
