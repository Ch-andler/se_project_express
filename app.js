const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");

const app = express();
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
app.use("/", mainRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
