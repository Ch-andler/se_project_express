const router = require("express").Router();
const {
  getUsers,
  updateCurrentUser,
  getCurrentUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

// Protect all user routes with the auth middleware
router.use(auth);

// Get the current user's details (protected route)
router.get("/me", getUsers, getCurrentUser);

// Update the current user's details (protected route)
router.patch("/me", updateCurrentUser);

module.exports = router;
