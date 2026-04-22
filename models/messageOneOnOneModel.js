const mongoose = require("mongoose");

const messageOneOnOneSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConversationOneOnOne",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "system"],
      default: "text",
    },
  },
  {
    timestamps: true,
  }
);

messageOneOnOneSchema.index({ conversation: 1, createdAt: -1 });
messageOneOnOneSchema.index({ sender: 1, createdAt: -1 });

module.exports = mongoose.model("MessageOneOnOne", messageOneOnOneSchema);
