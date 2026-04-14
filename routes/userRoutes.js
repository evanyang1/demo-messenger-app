const userModel = require("../models/userModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const express = require("express");

const userRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

userRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await userModel({
      email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    const token = createToken(user._id);
    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email }).populate("tasks");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = createToken(user._id);
    const { password: _, ...userWithoutPassword } = user.toObject();
    res.status(200).json({ success: true, token, user: userWithoutPassword });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
});

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

userRouter.get("/getUser", authMiddleware, async (req, res) => {
  // The user is attached to req by the authMiddleware
  const user = req.user;
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ success: true, user });
});

module.exports = userRouter;