const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
var bodyParser = require("body-parser");
const books = require("./routes/books");
const user = require("./routes/user");
const product = require("./routes/product");
const review = require("./routes/review");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// Initialize app
const app = express();

// Set path to .env file and check for errors
const dotenvConfig = dotenv.config();
if (dotenvConfig.error) {
  console.error("Error: with ENV");
}

// Use the cors middleware options to configure which domains can be accessed
app.use(cors());

// allows req.body and req.query params able to be accessed
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Lets you create,send,read cookies
app.use(cookieParser());

// runs anytime a request is made
app.use((req, res, next) => {
  console.log("+-----------------------------------------------+");
  console.log(`Route '${req.path}' made a ${req.method} request`);
  console.log("Time: " + new Date());
  console.log("+-----------------------------------------------+");

  next();
});

//routes
app.use("/api/books", books);
app.use("/api/user", user);
app.use("/api/product", product);
app.use("/api/review", review);

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
      console.log(`Express server listening on http://localhost:${PORT}/`)
    );
  })
  .catch((err) => {
    console.log("Mongoose error: " + err);
  });
