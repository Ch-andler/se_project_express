const clothingItemSchema = require("../models/clothingItem");
const { badRequest, notFound, serverError } = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req.user._id);
  console.log(req);
  console.log(req.body);
  const owner = req.user._id;
  const { name, weather, imageUrl } = req.body;

  clothingItemSchema
    .create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(badRequest)
          .send({ message: "An error has occurred on the server" });
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
      if (err.name === "ValidationError") {
        return res
          .status(badRequest)
          .send({ message: "An error has occurred on the server" });
      }
      return res
        .status(serverError)
        .send({ message: "Error from getItems", err });
    });
};

/* const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  clothingItemSchema
    .findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(badRequest)
          .send({ message: "An error has occurred on the server" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFound)
          .send({ message: "An error has occurred on the server" });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server" });
    });
}; */

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  clothingItemSchema
    .findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(badRequest)
          .send({ message: "An error has occurred on the server" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFound)
          .send({ message: "An error has occurred on the server" });
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
        return res
          .status(notFound)
          .send({ message: "An error has occurred on the server" });
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
        return res
          .status(notFound)
          .send({ message: "An error has occurred on the server" });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
