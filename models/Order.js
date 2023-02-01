const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema(
  {
    address: {},
    phone: String,
    note: String,
    tip: Number,
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
      default: "Not Processed",
      enum: [
        "Not Processed",
        "Cash On Delivery",
        "Processing",
        "Dispatched",
        "Cancelled",
        "Completed",
      ],
    },
    orderedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
