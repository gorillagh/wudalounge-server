const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { ObjectId } = Schema;

const drinkSchema = new Schema(
  {
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
    // category: {
    //   type: ObjectId,
    //   ref: "Category",
    //   required: true,
    // },

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
drinkSchema.index({ "$**": "text" });

module.exports = model("Drink", drinkSchema);
