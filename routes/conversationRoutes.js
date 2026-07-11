const conversationOneOnOneModel = require("../models/conversationOneOnOneModel");
const express = require("express");

const conversationRouter = express.Router();

conversationRouter.get("/byParticipants", async (req, res) => {
  try {
    const { user1, user2 } = req.query;
    const conversation = await conversationOneOnOneModel.findOne({
      participants: { $all: [user1, user2], $size: 2 },
    });
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

conversationRouter.get("/:id", async (req, res) => {
  try {
    const conversation = await conversationOneOnOneModel.findById(
      req.params.id,
    );
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

conversationRouter.post("/createConversation", async (req, res) => {
  try {
    const conversation = await conversationOneOnOneModel.create(req.body);
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = conversationRouter;