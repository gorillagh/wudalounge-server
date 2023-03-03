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

const currency = require("currency.js");

exports.getDashboardBriefs = async (req, res) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayOrders = await Order.find({
      createdAt: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    }).exec();
    const todayTotal = todayOrders.reduce((acc, order) => {
      return acc + order.paymentIntent.amount / 100;
    }, 0);

    // const today = new Date();
    // today.setHours(0, 0, 0, 0); // Set time to start of the day

    // const todayTotal = await Order.aggregate([
    //   {
    //     $match: {
    //       createdAt: { $gte: today },
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       totalAmount: { $sum: "$totalAmount" },
    //     },
    //   },
    // ]).exec();

    const allTimeOrders = await Order.find().exec();
    const allTimeTotal = allTimeOrders.reduce((acc, order) => {
      return acc + order.paymentIntent.amount / 100;
    }, 0);
    const todayOrdersNumber = await Order.countDocuments({
      createdAt: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    }).exec();
    const allTimeOrdersNumber = await Order.countDocuments().exec();
    const uncompletedNumber = await Order.countDocuments({
      orderStatus: "processing",
    }).exec();
    const customersTotal = await User.countDocuments({
      role: "subscriber",
    }).exec();
    const staffTotal = await User.countDocuments({ role: "staff" }).exec();
    const adminsTotal = await User.countDocuments({ role: "admin" }).exec();
    const dishesTotal = await Dish.countDocuments().exec();
    const drinksTotal = await Drink.countDocuments().exec();
    // const todayReports = await Report.countDocuments().exec()
    res.json({
      ordersInfo: {
        todayTotal,
        todayOrdersNumber,
        allTimeTotal,
        allTimeOrdersNumber,
        // uncompletedTotal,
        uncompletedNumber,
      },
      usersInfo: { customersTotal, staffTotal, adminsTotal },
      menuInfo: { dishesTotal, drinksTotal },
      // reportsInfo:{todayReports}
    });
  } catch (error) {
    console.log(error);
    console.error(error);
    return res.status(500).send("Error retrieving orders");
  }
};

//Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadDishImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.uri, {
      public_id: uuid(),
      resource_type: "auto",
    });
    res.json({ public_id: result.public_id, url: result.secure_url });
  } catch (error) {
    console.log(error);
  }
};

exports.createMenu = async (req, res) => {
  try {
    const slug = await slugify(req.body.data.name);
    req.body.data.slug = await slug;
    console.log("new body--->", req.body.data);
    if (req.body.type === "item") {
      await new Item(req.body.data).save();
      res.json("ok");
      return;
    }
    if (req.body.type === "subcategory") {
      await new Subcategory(req.body.data).save();
      res.json("ok");
      return;
    }
    if (req.body.type === "category") {
      await new Category(req.body.data).save();
      res.json("ok");
      return;
    }
    if (req.body.type === "dish") {
      await new Dish(req.body.data).save();
      res.json("ok");
      return;
    }
    if (req.body.type === "drink") {
      await new Drink(req.body.data).save();
      res.json("ok");
      return;
    }
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      res.json({ error: { message: "Name already used" } });
    } else {
      res.json({ error: { message: error.message } });
    }
  }
};

exports.getDishSubs = async (req, res) => {
  try {
    const items = await Item.find().exec();
    const categories = await Category.find().exec();
    const subcategories = await Subcategory.find().exec();
    res.json({ categories, items, subcategories });
  } catch (error) {
    console.log(error);
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("orderedBy")
      .sort([["createdAt", "desc"]])
      .exec();
    res.json(orders);
  } catch (error) {
    console.log(error);
  }
};
