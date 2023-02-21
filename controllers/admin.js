const User = require("../models/User");
const Order = require("../models/Order");
const Dish = require("../models/Dish");

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

    const allTimeOrders = await Order.find().exec();
    const allTimeTotal = allTimeOrders.reduce((acc, order) => {
      return acc + order.paymentIntent.amount / 100;
    }, 0);
    const todayOrdersNumber = await Order.find({
      createdAt: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    })
      .countDocuments()
      .exec();
    const allTimeOrdersNumber = await Order.countDocuments().exec();
    const usersTotal = await User.countDocuments().exec();
    const dishesTotal = await Dish.countDocuments().exec();
    // const todayReports = await Report.countDocuments().exec()
    console.log("Number of users---->", usersTotal);
    res.json({
      ordersInfo: {
        todayTotal,
        todayOrdersNumber,
        allTimeTotal,
        allTimeOrdersNumber,
      },
      usersInfo: { total: usersTotal },
      menuInfo: { dishesTotal },
      // reportsInfo:{todayReports}
    });
  } catch (error) {
    console.log(error);
    console.error(error);
    return res.status(500).send("Error retrieving orders");
  }
};
