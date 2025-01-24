const router = require("express").Router();
const {
  getUsers,
  createUser,
  login,
  updateCurrentUser,
} = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);
router.get("/me", getUsers);
router.patch("/me", updateCurrentUser);

module.exports = router;
