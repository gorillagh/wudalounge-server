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

const moment = require("moment");

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

    //Get order chart info///////

    // const startOfCurrentWeek = moment().startOf("week").toDate();
    // const endOfCurrentWeek = moment().endOf("week").toDate();
    const startOfPastSevenDays = moment()
      .subtract(7, "days")
      .startOf("day")
      .toDate();
    const endOfToday = moment().endOf("day").toDate();
    let weeklyOrderChart = [];
    const results = await Order.aggregate([
      // Match orders within the current week
      {
        $match: {
          createdAt: {
            $gte: startOfPastSevenDays,
            $lte: endOfToday,
          },
        },
      },
      // Group orders by date and count the total number of orders for each day
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
          totalAmount: { $sum: "$paymentIntent.amount" },
        },
      },
      // Project the results to include only the date and count fields
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: {
                $dateFromParts: {
                  year: "$_id.year",
                  month: "$_id.month",
                  day: "$_id.day",
                },
              },
            },
          },
          count: 1,
          totalAmount: {
            $divide: ["$totalAmount", 100],
          },
        },
      },
      // Round totalAmount to 2 decimal places
      // {
      //   $project: {
      //     date: 1,
      //     count: 1,
      //     totalAmount: {
      //       $round: ["$totalAmount", 2],
      //     },
      //   },
      // },
    ]).exec();
    console.log("results--->", results);
    // Create an array of objects representing each day of the current week

    const currentDate = moment().startOf("week");

    for (let i = 0; i < 7; i++) {
      const date = currentDate.format("YYYY-MM-DD");
      const dayOfWeek = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
      }).format(new Date(date));
      const orders = results.find((result) => result.date === date);
      const count = orders ? orders.count : 0;
      const totalAmount = orders ? orders.totalAmount : 0; // Divide by 100 to get the total amount in dollars

      weeklyOrderChart.push({
        date: date,
        count: count,
        totalAmount: totalAmount,
        day: dayOfWeek,
      });

      currentDate.add(1, "day");
    }

    // Do something with the currentWeek array
    console.log("Inside", weeklyOrderChart);
    console.log("outside---->", weeklyOrderChart);
    ////////////

    res.json({
      ordersInfo: {
        todayTotal,
        todayOrdersNumber,
        allTimeTotal,
        allTimeOrdersNumber,
        // uncompletedTotal,
        uncompletedNumber,
        weeklyOrderChart,
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
      .sort([["createdAt", "asc"]])
      .exec();
    res.json(orders);
  } catch (error) {
    console.log(error);
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("favorites")
      .sort([["createdAt", "asc"]])
      .exec();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.userId },
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
