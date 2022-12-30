const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const notificationListSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NotificationList", notificationListSchema);
