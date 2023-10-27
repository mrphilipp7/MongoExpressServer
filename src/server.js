const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
var bodyParser = require("body-parser");
const books = require("./routes/books");
const user = require("./routes/user");
const product = require("./routes/product");
const review = require("./routes/review");
const logout = require("./routes/logout");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");

// Initialize app
const app = express();

//change res headers to hide api stack
app.use(helmet());

// Set path to .env file and check for errors
const dotenvConfig = dotenv.config();
if (dotenvConfig.error) {
  console.error("Error: with ENV");
}

// Use the cors middleware options to configure which domains can be accessed
const corsOptions = {
  credentials: true,
  origin: function (origin, callback) {
    //use a regex to allow your domain to include all sub-routes
    if (/^http:\/\/localhost:5173/.test(origin)) {
      callback(null, true);
    } else {
      console.log("CORS Blocked");
      callback("Not allowed by CORS");
    }
  },
};

app.use(cors(corsOptions));

// allows req.body and req.query params able to be accessed
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Lets you create,send,read cookies
app.use(cookieParser());

// runs anytime a request is made
app.use(morgan("tiny"));

//routes
app.use("/api/books", books);
app.use("/api/user", user);
app.use("/api/product", product);
app.use("/api/review", review);
app.use("/api/logout", logout);

//error handler for invalid routes
app.get("*", (req, res) => {
  res.send("ERROR: Invalid route");
});

//connect to db
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to Mongo");
    // start and run server
    const PORT = process.env.SERVER_PORT;
    app.listen(PORT, () =>
      console.log(
        `*** Express server listening on http://localhost:${PORT}/ ***`
      )
    );
  })
  .catch((err) => {
    console.log("Mongoose error: " + err);
  });
