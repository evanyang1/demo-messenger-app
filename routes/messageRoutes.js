const messageOneOnOneModel = require('../models/messageOneOnOneModel');
const conversationOneOnOneModel = require('../models/conversationOneOnOneModel');
const express = require("express");
const messageRouter = express.Router();

messageRouter.get("/:id", async (req, res) => {
  try {
    const message = await messageOneOnOneModel.findById(req.params.id);
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

messageRouter.get("/conversation/:conversationId", async (req, res) => {
  try {
    const messages = await messageOneOnOneModel
      .find({ conversation: req.params.conversationId })
      .sort({ createdAt: 1 })
      .populate("sender", "name");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

messageRouter.post("/createMessage", async (req, res) => {
  try {
    const message = await messageOneOnOneModel.create(req.body);

    await conversationOneOnOneModel.findByIdAndUpdate(
      req.body.conversation,
      { $push: { messages: message._id } },
    );

    const populatedMessage = await messageOneOnOneModel
      .findById(message._id)
      .populate("sender", "name");

    const io = req.app.get("io");
    if (io) {
      io.to(req.body.conversation).emit("newMessage", populatedMessage);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = messageRouter;