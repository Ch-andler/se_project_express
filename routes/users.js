const router = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");
const { updateCurrentUser, getCurrentUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

// Protect all user routes with the auth middleware
router.use(auth);

// Validation schema for updating user
const updateUserValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    avatar: Joi.string().uri().optional(),
  }),
});

// Get the current user's details (protected route)
router.get("/me", getCurrentUser);

// Update the current user's details (protected route)
router.patch("/me", updateUserValidation, updateCurrentUser);

module.exports = router;
