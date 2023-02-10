const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { ObjectId } = Schema;

const dishSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 70,
      text: true,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      text: true,
    },
    subcategories: [
      {
        type: ObjectId,
        ref: "SubCategory",
        text: true,
      },
    ],
    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    image: {
      type: String,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
      text: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    ratings: [
      {
        star: Number,
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);
dishSchema.index({ "$**": "text" });

module.exports = model("Dish", dishSchema);
