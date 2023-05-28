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
const axios = require("axios");

const Pusher = require("pusher");

const pusher = new Pusher({
  appId: process.env.PUSHER_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

const sendSMS = async (phoneNumber, reference) => {
  const customerData = {
    recipient: [`0${phoneNumber.slice(-9)}`],
    sender: "Wudalounge",
    message: `Your order (Id: ${reference.slice(
      -9
    )}) has been delivered! Enjoy your meal and thanks for choosing Wuda Lounge!`,

    is_schedule: "false",
    schedule_date: "",
  };
  const adminData = {
    recipient: ["0240298910"],
    sender: "Wudalounge",
    message: `Order delivered. Id: ${reference.slice(-9)}.`,
    is_schedule: "false",
    schedule_date: "",
  };
  const headers = {
    "content-type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  };

  try {
    ///send to customer
    const customerResponse = await axios.post(
      `https://api.mnotify.com/api/sms/quick?key=${process.env.MNOTIFY_API_KEY}`,
      customerData,
      {
        headers,
      }
    );
    ///Send to admin
    const adminResponse = await axios.post(
      `https://api.mnotify.com/api/sms/quick?key=${process.env.MNOTIFY_API_KEY}`,
      adminData,
      {
        headers,
      }
    );
    console.log(
      "Sent to user response====>",
      customerResponse.data,
      customerResponse.data
    );
    console.log(
      "Sent to admin response====>",
      adminResponse.data,
      adminResponse.data
    );
  } catch (error) {
    console.log(error);
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.params.orderId },
      req.body,
      {
        new: true,
      }
    ).exec();
    if (updatedOrder.orderStatus === "completed") {
      await sendSMS(updatedOrder.phoneNumber, updatedOrder.reference);
    }
    pusher.trigger("orderUpdate", "order-updated", updatedOrder);

    res.json("ok");
  } catch (error) {
    console.log(error);
  }
};
