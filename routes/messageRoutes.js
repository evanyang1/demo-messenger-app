const messageOneOnOneModel = require('../models/messageOneOnOneModel');
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

messageRouter.post("/createMessage", async (req, res) => {
  try {
    const message = await messageOneOnOneModel.create(req.body);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = messageRouter;