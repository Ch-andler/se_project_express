const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const { notFound } = require("../utils/errors");

// Public routes
router.post("/signin", login);
router.post("/signup", createUser);

// Public route for getting all items (handled in itemRouter)
router.use("/items", itemRouter);

router.use("/users", userRouter);

// Catch-all for unmatched routes
router.use((req, res) => {
  res.status(notFound).send({ message: "Router not found" });
});

module.exports = router;
