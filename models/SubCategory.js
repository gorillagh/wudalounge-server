const { Schema, model, isValidObjectId } = require("mongoose");
const { ObjectId } = Schema;

const subCategorySchema = new Schema(
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
    type: { type: String, enum: ["food", "drink"], required: true },
  },
  { timestamps: true }
);
subCategorySchema.index({ "$**": "text" });

module.exports = model("SubCategory", subCategorySchema);
