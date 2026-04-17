const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["member", "admin"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    lastReadMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    mutedUntil: {
      type: Date,
      default: null,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const conversationSchema = new mongoose.Schema(
  {
    conversationType: {
      type: String,
      enum: ["direct", "group"],
      required: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },
    participants: {
      type: [participantSchema],
      validate: {
        validator: function (value) {
          return Array.isArray(value) && value.length >= 2;
        },
        message: "A conversation must have at least 2 participants",
      },
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ "participants.user": 1, updatedAt: -1 });
conversationSchema.index({ createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("Conversation", conversationSchema);
