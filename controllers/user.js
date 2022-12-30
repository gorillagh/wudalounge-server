const NotificationList = require("../models/NotificationList");

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
