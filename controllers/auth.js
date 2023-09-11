const fs = require("fs/promises");
const path = require("path");
const gravatar = require("gravatar");
const Jimp = require("jimp");

require("dotenv").config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { controllerWrapper } = require("../decorators");
const { HttpError } = require("../helpers");

const User = require("../models/User");

const { JWT_SECRET } = process.env;

const avatarPath = path.resolve("public", "avatars");

const signUp = async (req, res) => {
  const { email, password } = req.body;
  const avatar = gravatar.url(email, { s: "250", r: "pg", d: "mp" });
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    ...req.body,
    avatarUrl: avatar,
    password: hashPassword,
  });
  res.status(201).json({
    email: newUser.email,
    subscription: newUser.subscription,
  });
};

const signIn = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user._id, { token });

  res.status(200).json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

const logOut = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({ message: "You have been logged out" });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;

  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);
  await fs.rename(oldPath, newPath);

  await Jimp.read(newPath)
    .then((img) => img.resize(250, 250).writeAsync(newPath))
    .catch((err) => {
      throw HttpError(404, err.message);
    });

  const avatarUrl = `/avatars/${filename}`;

  const newUser = await User.findByIdAndUpdate(
    _id,
    { avatarUrl },
    { new: true }
  );

  if (!newUser) {
    throw HttpError(404, "User not found");
  }
  res.status(200).json(avatarUrl);
};

module.exports = {
  signUp: controllerWrapper(signUp),
  signIn: controllerWrapper(signIn),
  getCurrent: controllerWrapper(getCurrent),
  logOut: controllerWrapper(logOut),
  updateAvatar: controllerWrapper(updateAvatar),
};
