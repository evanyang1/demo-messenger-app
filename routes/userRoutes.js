const userModel = require("../models/userModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");

const express = require("express");

const userRouter = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

userRouter.post("/register", async (req, res) => {
  const { email, password, name } = req.body;

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
      name,
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
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = createToken(user._id);
    const populatedUser = await user.populate(
      "usersInConversation",
      "name email avatarUrl status",
    );
    const { password: _, ...userWithoutPassword } = populatedUser.toObject();
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
  try {
    const user = await userModel
      .findById(req.user._id)
      .populate("usersInConversation", "name email avatarUrl status")
      .select("-password");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add user to the current user's chat list, also add sender to receiver's chat list
userRouter.post("/addUserChat", authMiddleware, async (req, res) => {
  const { userEmailQuery } = req.body;
  const currentUser = req.user;
  try {
    usersInConversation = currentUser.usersInConversation || [];
    // make sure this user exists, then make sure this user doesn't exist in the array, then add this user to the array
    const userToAdd = await userModel.findOne({ email: userEmailQuery });
    if (!userToAdd) {
      return res.status(404).json({ message: "User not found" });
    } else if (usersInConversation.includes(userToAdd._id)) {
      console.log("User already in chat list");
      return res.status(400).json({ message: "User already in chat list" });
    } else {
      usersInConversation.push(userToAdd._id);
      currentUser.usersInConversation = usersInConversation;
      await currentUser.save();

      // also add current user to the other user's chat list
      const otherUserChatList = userToAdd.usersInConversation || [];
      if (!otherUserChatList.includes(currentUser._id)) {
        otherUserChatList.push(currentUser._id);
        userToAdd.usersInConversation = otherUserChatList;
        await userToAdd.save();
      }
      return res
        .status(200)
        .json({ success: true, message: "User added to chat list" });
    }
  } catch (error) {
    console.error("Error adding user to chat list:", error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = userRouter;
