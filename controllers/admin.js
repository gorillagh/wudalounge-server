const User = require("../models/User");

const currency = require("currency.js");

exports.getOrders = async (req, res) => {
  try {
    //
  } catch (error) {
    console.log("Error getting order---->", error);
  }
  const { email } = req.headers;
  const user = await User.findOne({ email }).exec();
  if (user) {
    res.json(null);
  } else res.json("ok");
};
