const clothingItemSchema = require("../models/clothingItem");
const {
  badRequest,
  notFound,
  serverError,
  FORBIDDEN,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req.user._id);
  console.log(req);
  console.log(req.body);
  const { name, weather, imageUrl } = req.body;

  clothingItemSchema
    .create({ name, weather, imageUrl, owner: req.user._id, likes, createdAt })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(badRequest).send({ message: "Invalid Data" });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server" });
    });
};

const getItems = (req, res) => {
  clothingItemSchema
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res.status(serverError).send({ message: "Error from getItems" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const { _id: userId } = req.user;

  console.log(itemId);
  clothingItemSchema
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        return res
          .status(FORBIDDEN)
          .send({ message: "You do not have permission to delete this item" });
      }
      return clothingItemSchema
        .findByIdAndDelete(itemId)
        .then(() => res.send({ message: "Item successfully deleted" }));
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(badRequest)
          .send({ message: "An error has occurred on the server" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Data was not found" });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server" });
    });
};

const likeItem = (req, res) => {
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
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(badRequest)
          .send({ message: "An error has occurred on the server" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Data was not found" });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server" });
    });
};

const dislikeItem = (req, res) => {
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
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(badRequest)
          .send({ message: "An error has occurred on the server" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "Data was not found" });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
