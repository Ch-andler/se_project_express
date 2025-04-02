require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");

const app = express();

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

// Crash test route
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(requestLogger);

// API routes
app.use("/", mainRouter);

/* // Static files
app.use(
  "/se_project_react",
  express.static(path.join(__dirname, "../se_project_react/dist"))
); */

// Catch-all route for React app
/* app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../se_project_react/dist/index.html"));
}); */

// Error handling
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
