const { Schema, model } = require("mongoose");

const ExtraItemSchema = new Schema(
  {
    name: {
      type: String,
      required: "Name is required",
      trim: true,
      minLength: [2, "Too short"],
      maxLength: [35, "Too long"],
      text: true,
    },
    additionalAmount: Number,
    checked: { type: Boolean, default: false },
    quantity: { type: Number, default: 1 },
  },
  { timestamps: true }
);
ExtraItemSchema.index({ "$**": "text" });

module.exports = model("ExtraItem", ExtraItemSchema);
