const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const httpErrors = require("http-errors"); // Import http-errors
const User = require("../models/user");
const ConflictError = require("../errors/ConflictError");
const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const NotFoundError = require("../errors/NotFoundError");

const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res, next) => {
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
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found."));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
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
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data sent"));
      }
      if (err.name === "InvalidEmailError") {
        return next(new ConflictError("Please try a different email address."));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Invalid data entered"));
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
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(err);
    });
};

const updateCurrentUser = (req, res, next) => {
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
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid data entered"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found."));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data entered"));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  getCurrentUser,
  login,
  updateCurrentUser,
};
