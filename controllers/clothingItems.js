const clothingItemSchema = require("../models/clothingItem");
const ClothingItem = require("../models/clothingItem");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
/* const {
  badRequest,
  notFound,
  serverError,
  FORBIDDEN,
} = require("../utils/errors"); */

const createItem = (req, res, next) => {
  console.log(req.user._id);
  console.log(req);
  console.log(req.body);
  const { name, weather, imageUrl } = req.body;

  clothingItemSchema
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data entered"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data entered"));
      }
      return next(err);
    });
};

const getItems = (req, res, next) => {
  clothingItemSchema
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found."));
      }
      return next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  console.log(itemId);
  clothingItemSchema
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        return next(new ForbiddenError("You do not own this item."));
      }

      return ClothingItem.findByIdAndDelete(itemId).then((item) => {
        res.send({ message: `deleted item with ID: ${item._id}` });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data entered."));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found."));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  console.log(req.user._id);
  clothingItemSchema
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data entered"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found"));
      }
      return next(err);
    });
};

const dislikeItem = (req, res, next) => {
  console.log(req.user._id);
  clothingItemSchema
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data entered."));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found"));
      }
      return next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
