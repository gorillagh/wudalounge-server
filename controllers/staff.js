const Order = require("../models/Order");
const Report = require("../models/Report");

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

    res.json({
      ordersInfo: {
        todayTotal,
        todayOrdersNumber,
        allTimeTotal,
        allTimeOrdersNumber,
        // uncompletedTotal,
        uncompletedNumber,
      },
      // reportsInfo:{todayReports}
    });
  } catch (error) {
    console.log(error);
    console.error(error);
    return res.status(500).send("Error retrieving orders");
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("orderedBy")
      .populate("processedBy.userId")
      .sort([["createdAt", "desc"]])
      .exec();
    res.json(orders);
  } catch (error) {
    console.log(error);
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reportedBy")
      .populate("processedBy.userId")
      .sort([["createdAt", "desc"]])
      .exec();
    res.json(reports);
  } catch (error) {
    console.log(error);
  }
};
