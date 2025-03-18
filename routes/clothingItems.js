const router = require("express").Router();
const { celebrate, Joi, Segments } = require("celebrate");
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

// Validation schemas
const itemIdValidation = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required(), // Assuming MongoDB ObjectId
  }),
});

const createItemValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    imageUrl: Joi.string().uri().required(),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
  }),
});

// Routes with validation
router.post("/", auth, createItemValidation, createItem);
router.get("/", getItems);
router.delete("/:itemId", auth, itemIdValidation, deleteItem);
router.put("/:itemId/likes", auth, itemIdValidation, likeItem);
router.delete("/:itemId/likes", auth, itemIdValidation, dislikeItem);

module.exports = router;
