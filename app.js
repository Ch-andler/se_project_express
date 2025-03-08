require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const app = express();
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { PORT = 3001 } = process.env;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.error("Error connecting to DB:", error);
  });

// Middleware
app.use(express.json());
app.use(cors());

// Main router
app.use(requestLogger);
app.use("/", mainRouter);

app.use(errorLogger); // enabling the error logger

app.use(errors());
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
