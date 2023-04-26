const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { ObjectId } = Schema;

const dishSchema = new Schema(
  {
    restaurant: { type: String, required: true },
    image: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 70,
      text: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      maxlength: 2000,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 32,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },

    subcategories: [
      {
        type: ObjectId,
        ref: "SubCategory",
      },
    ],
    ingredients: {
      type: [String],
      // required: true,
    },
    sizes: [
      {
        size: String,
        additionalAmount: Number,
        description: String,
      },
    ],
    extras: [
      {
        type: ObjectId,
        ref: "Item",
      },
    ],

    // isAvailable: {
    //   Type: Boolean,
    //   default: true,
    // },
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
