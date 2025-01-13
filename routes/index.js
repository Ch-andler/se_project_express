const router = require("express").Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", itemRouter);

const NOT_FOUND = 404;

router.use((req, res, next) => {
  res.status(NOT_FOUND).send({ message: "Router not found" });
});

/* router.use((req, res) => {
  res.status(404).send({ message: "Router not found" });
}); */

module.exports = router;
