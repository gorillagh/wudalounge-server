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

exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.params.orderId },
      req.body,
      {
        new: true,
      }
    ).exec();
    res.json("ok");
  } catch (error) {
    console.log(error);
  }
};
