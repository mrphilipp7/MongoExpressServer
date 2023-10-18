const jwt = require("jsonwebtoken");

/**
 * @desc middleware on auth required routes to validate access token and assign new one
 */
const validateToken = async (req, res, next) => {
  console.log("validating...");
  const AccessToken = req.cookies.AccessToken;

  //verify the access token
  jwt.verify(
    AccessToken,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decodedInfomation) => {
      //access token as expired or is invalid
      if (err) {
        const RefreshToken = req.cookies.RefreshToken;
        //error handle for expired refresh token
        if (!RefreshToken) {
          console.log("Refresh Token is missing");
          res.status(403).send({ error: "Refresh Token is missing" });
        }

        //verifying the refresh token
        jwt.verify(
          RefreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          (err, decodedInfomation) => {
            if (err) {
              console.log("Refresh Token is invalid");
              res.status(403).send("Refresh Token is invalid");
            }
            //generate a new access token
            console.log("generating new access token..");
            const NewAccessToken = jwt.sign(
              decodedInfomation,
              process.env.ACCESS_TOKEN_SECRET
            );

            console.log("new access token created..");

            //new token is saved over old one
            res.cookie("AccessToken", NewAccessToken, {
              httpOnly: true,
              maxAge: 900000, // 15 min in milliseconds
            });

            console.log("valid");
            req.user = decodedInfomation;
            next();
          }
        );
      } else {
        console.log("valid");
        req.user = decodedInfomation;
        next();
      }
    }
  );
};

module.exports = validateToken;
