const User = require("../models/User");
const Order = require("../models/Order");
const Dish = require("../models/Dish");
const Drink = require("../models/Drink");
const Item = require("../models/Item");
const Category = require("../models/Category");
const Subcategory = require("../models/SubCategory");
const { v4: uuid } = require("uuid");
const cloudinary = require("cloudinary").v2;
const slugify = require("slugify");

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.params.orderId },
      req.body,
      {
        new: true,
      }
    ).exec();
    pusher.trigger("orderUpdate", "order-updated", updatedOrder);

    res.json("ok");
  } catch (error) {
    console.log(error);
  }
};
