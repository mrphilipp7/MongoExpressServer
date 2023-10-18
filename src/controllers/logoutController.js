/**
 * @desc log out user
 * @route POST api/logout
 * @access public
 */
const logoutUser = async (req, res) => {
  //clears all cookies in session
  res.clearCookie("AccessToken");
  res.clearCookie("RefreshToken");
  res.status(200).send({ message: "Logged out successfully" });
};

module.exports = { logoutUser };
