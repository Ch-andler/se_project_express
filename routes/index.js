const router = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const NotFoundError = require("../errors/NotFoundError");

// Validation schemas
const authValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

const signupValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().optional(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
});

// Public routes with validation
router.post("/signin", authValidation, login);
router.post("/signup", signupValidation, createUser);

// Public route for getting all items (handled in itemRouter)
router.use("/items", itemRouter);
router.use("/users", userRouter);

// Catch-all for unmatched routes with centralized error handling
router.use((req, res, next) => {
  next(new NotFoundError("Route not found"));
});

module.exports = router;
