
const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 120,
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: 1000,
    },

    dueAt: {
      type: Date,
      required: [true, "Date & time is required"],
      index: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    status: {
      type: String,
      enum: ["In Progress", "Completed"],
      default: "In Progress",
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ user: 1, dueAt: 1 });

module.exports = mongoose.model("Task", taskSchema);
