const NotificationList = require("../models/NotificationList");
const User = require("../models/User");
const Order = require("../models/Order");

exports.addToNotificationList = async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = await NotificationList.findOne({
      email,
    }).exec();
    if (subscriber) {
      res.json("Email exists");
    } else {
      const newSubscriber = await new NotificationList({
        email,
      }).save();
      res.json("Ok");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const _id = req.params.slug;

    const updatedUser = await User.findOneAndUpdate({ _id }, req.body, {
      new: true,
    }).exec();
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
  }
};

exports.getOrders = async (req, res) => {
  try {
    const _id = req.params.slug;
    console.log("user id", _id);
    const orders = await Order.find({ orderedBy: _id })
      .sort([["createdAt", "desc"]])
      .exec();

    res.json(orders);
  } catch (error) {
    console.log(error);
  }
};
