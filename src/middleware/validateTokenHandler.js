const jwt = require("jsonwebtoken");

/*
To validate (using thunderclient)
-Go into the Auth portion and c/p the auth token that is generated (no quotes)
-Go to Headers portion and add 'Authorization' under headers and add the string "Bearer + token"
*/

// const validateToken = async (req, res, next) => {
//   console.log("validating...");
//   console.log("Cookies: ", req.cookies);
//   let token;
//   let authHeader = req.headers.Authorization || req.headers.authorization;
//   if (authHeader && authHeader.startsWith("Bearer")) {
//     token = authHeader.split(" ")[1];
//     jwt.verify(
//       token,
//       process.env.ACCESS_TOKEN_SECRET,
//       (err, decodedInfomation) => {
//         if (err) {
//           res.status(401);
//           throw new Error("Authentication is not valid");
//         } else {
//           console.log("valid");
//           req.user = decodedInfomation;
//           next();
//         }
//       }
//     );
//     if (!token) {
//       res.status(401);
//       throw new Error("User not authenticated or token is missing");
//     }
//   }
// };

const validateToken = async (req, res, next) => {
  console.log("validating...");
  token = req.cookies.Token;
  jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedInfomation) => {
    if (err) {
      res.status(401).send({ error: "Authentication is not valid" });
    } else {
      console.log("valid");
      req.user = decodedInfomation;
      next();
    }
  });
  if (!token) {
    res
      .status(401)
      .send({ error: "User not authenticated or token is missing" });
  }
};

module.exports = validateToken;
