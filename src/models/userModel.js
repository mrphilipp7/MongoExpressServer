const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter a username"],
      minlength: [2, "Please enter a minimum of two characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter an email address"],
      unique: [true, "Email is already taken"],
      lowercase: true,
      validate: [isEmail, "Please make sure your email is valid"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
