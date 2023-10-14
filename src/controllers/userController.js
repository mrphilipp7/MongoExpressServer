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
    res.status(400).send({ error: "All fields are required" });
  }

  const user = await User.findOne({ email });
  //compare password
  if (user && (await bcrypt.compare(password, user.password))) {
    const Token = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("Token", Token, {
      httpOnly: true, // Ensures the cookie is only accessible via HTTP(S) requests, not JavaScript
      maxAge: 3600000, // 1 hour in milliseconds
    });

    res.status(200).send({
      user: { id: user.id, email: user.email, username: user.username },
    });
  } else {
    res.status(401).send({ error: "Email or password is incorrect" });
  }
};

/**
 * @desc get user info
 * @route GET api/user/current
 * @access private
 */
const currentUser = async (req, res) => {
  res.send({ user: req.user });
};

module.exports = { registerUser, loginUser, currentUser };
