const jwt = require("jsonwebtoken");

/**
 * @desc middleware for validating httponly acces/refresh tokens
 */
const validateToken = async (req, res, next) => {
  console.log("validating...");
  const AccessToken = req.cookies.AccessToken;

  try {
    const decodedInfomation = jwt.verify(
      AccessToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    // If access token is valid, continue to the next middleware
    req.user = decodedInfomation;
    next();
  } catch (err) {
    const RefreshToken = req.cookies.RefreshToken;

    // Handle errors related to access token expiration or invalidity
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      if (!RefreshToken) {
        console.log("Refresh Token is missing or invalid");
        return res.status(403).json({
          error: "Access Token and Refresh Token are invalid or expired",
        });
      }

      try {
        const decodedRefreshToken = jwt.verify(
          RefreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        console.log("generating new access token..");
        const NewAccessToken = jwt.sign(
          decodedRefreshToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        console.log("new access token created..");

        // Save the new access token in the response cookie
        res.cookie("AccessToken", NewAccessToken, {
          httpOnly: true,
          maxAge: 900000, // 15 min in milliseconds
        });

        req.user = decodedRefreshToken;
        next();
      } catch (refreshTokenError) {
        console.log("Refresh Token is invalid");
        return res.status(403).json({ error: "Refresh Token is invalid" });
      }
    } else {
      // Handle other types of errors
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

module.exports = validateToken;
