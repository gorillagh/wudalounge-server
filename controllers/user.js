const NotificationList = require("../models/NotificationList");
const User = require("../models/User");
const Order = require("../models/Order");
const cloudinary = require("cloudinary").v2;

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

//Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.uri, {
      public_id: `${req.params.slug}`,
      resource_type: "auto",
    });
    res.json({ public_id: result.public_id, url: result.secure_url });
  } catch (error) {
    console.log(error);
  }
};

exports.remove = (req, res) => {
  const image_id = req.body.public_id;
  cloudinary.uploader.destroy(image_id, (err, result) => {
    if (err) return res.json({ success: false, err });
    res.send("Delete successful");
  });
};
