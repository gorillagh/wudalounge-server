const { Schema, model } = require("mongoose");

const ItemSchema = new Schema(
  {
    name: {
      type: String,
      required: "Name is required",
      trim: true,
      minLength: [2, "Too short"],
      maxLength: [35, "Too long"],
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    additionalAmount: Number,
    checked: { type: Boolean, default: false },
    quantity: { type: Number, default: 1 },
  },
  { timestamps: true }
);
ItemSchema.index({ "$**": "text" });

module.exports = model("Item", ItemSchema);
