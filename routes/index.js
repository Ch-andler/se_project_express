const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");
const { NOT_FOUND } = require("../utils/errors");

// Public routes
router.post("/signin", login);
router.post("/signup", createUser);

// Public route for getting all items (handled in itemRouter)
router.use("/items", itemRouter);

// Protected routes
router.use(auth); // Apply auth middleware for subsequent routes

router.use("/users", userRouter);

// Catch-all for unmatched routes
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

module.exports = router;
