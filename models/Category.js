const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
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
  },
  { timestamps: true }
);
categorySchema.index({ "$**": "text" });

module.exports = model("Category", categorySchema);
