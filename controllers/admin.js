const User = require("../models/User");
const Order = require("../models/Order");
const Dish = require("../models/Dish");
const { v4: uuid } = require("uuid");

const currency = require("currency.js");

exports.getOrders = async (req, res) => {
  try {
    //
  } catch (error) {
    console.log("Error getting order---->", error);
  }
};

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
      menuInfo: { dishesTotal },
      // reportsInfo:{todayReports}
    });
  } catch (error) {
    console.log(error);
    console.error(error);
    return res.status(500).send("Error retrieving orders");
  }
};

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
