const NotificationList = require("../models/NotificationList");
const User = require("../models/User");
const Order = require("../models/Order");
const Dish = require("../models/Dish");
const Category = require("../models/Category");
const cloudinary = require("cloudinary").v2;

exports.getDishes = async (req, res) => {
  try {
    const dishes = await Dish.find({ restaurant: req.body.restaurant })
      .populate("category")
      .populate("extras")
      .populate("subcategories")
      .exec();

    const categories = await Category.find().exec();
    res.json({ dishes, categories });
  } catch (error) {
    console.log("Error loading dishes-->", error);
  }
};
