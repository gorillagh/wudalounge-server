const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    reference: String,
    dishes: Array,
    orderedBy: {
      type: ObjectId,
      ref: "User",
    },
    address: {},
    phoneNumber: String,
    deliveryMode: String,
    riderTip: Number,
    paymentMethod: {
      type: String,
      default: "cashless",
      enum: ["cashless", "cash"],
    },
    notes: String,
    // dishes: [
    //   {
    //     dish: {
    //       type: ObjectId,
    //       ref: 'Dish',
    //     },
    //     count: Number,
    //     color: String,
    //   },
    // ],
    paymentIntent: {},
    orderStatus: {
      type: String,
      default: "processing",
      enum: ["processing", "dispatched", "cancelled", "completed"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
