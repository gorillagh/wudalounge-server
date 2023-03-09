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

exports.getMenu = async (req, res) => {
  try {
    const dishes = await Dish.find()
      .populate("category")
      .populate("extras")
      .populate("subcategories")
      .exec();
    const drinks = await Drink.find().populate("subcategories").exec();
    const categories = await Category.find().exec();
    const items = await Item.find().exec();
    const subcategories = await Subcategory.find().exec();
    res.json({ dishes, drinks, items, categories, subcategories });
  } catch (error) {
    console.log(error);
  }
};
