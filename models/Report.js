const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const reportSchema = new mongoose.Schema(
  {
    reference: String,
    content: {},
    reportedBy: {
      type: ObjectId,
      ref: "User",
    },
    phoneNumber: String,

    notes: String,
    reportStatus: {
      type: String,
      default: "pending",
      enum: ["pending", "resolved"],
    },
    processedBy: [
      {
        userId: {
          type: ObjectId,
          ref: "User",
          required: true,
        },
        processedAt: {
          type: Date,
          default: Date.now(),
          required: true,
        },
        action: {
          type: String,
          enum: ["pending", "resolved"],
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
