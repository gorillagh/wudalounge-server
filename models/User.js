const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    favorites: {
      type: Array,
    },
    addresses: {
      type: Array,
    },
    email: {
      type: String,
      // required: true,
      index: true,
    },
    role: {
      type: String,
      default: "subscriber",
    },

    DoB: Date,

    Occupation: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
