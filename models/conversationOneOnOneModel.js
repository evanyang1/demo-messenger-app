const mongoose = require("mongoose");

const conversationOneOnOneSchema = new mongoose.Schema(
  {
    participants: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length >= 2;
        },
        message: "A conversation must have at least 2 participants",
      },
      required: true,
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  },
);

conversationOneOnOneSchema.index({ "participants.user": 1, updatedAt: -1 });
conversationOneOnOneSchema.index({ createdBy: 1, createdAt: -1 });

module.exports = mongoose.model(
  "ConversationOneOnOne",
  conversationOneOnOneSchema,
);
