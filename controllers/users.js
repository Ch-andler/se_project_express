const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  badRequest,
  notFound,
  serverError,
  CONFLICT,
  unauthorized,
} = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res) => {
  // user ID destructured from req.user
  const { _id: userId } = req.user;
  User.findById(userId)
    .orFail()
    .then((user) =>
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      })
    )
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res.status(badRequest).send({ message: "Invalid ID" });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userWithoutPassword = {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      };

      res.send(userWithoutPassword);
    })
    .catch((err) => {
      console.error("Error during user creation", err);
      if (err.code === 11000) {
        return res.status(CONFLICT).send({ message: "Email already exists" });
      }
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

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(badRequest)
      .send({ message: "Email and password are required" });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        res
          .status(unauthorized)
          .send({ message: "Incorrect email or password" });
      } else {
        res
          .status(serverError)
          .send({ message: "An error has occurred on the server" });
      }
    });
};

const updateCurrentUser = (req, res) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new Error("DocumentNotFoundError");
    })
    .then((user) => {
      res.send({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFound).send({ message: "User not found" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(badRequest)
          .send({ message: "Invalid data provided" });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateCurrentUser,
};
