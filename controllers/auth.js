const User = require("../models/User");

const currency = require("currency.js");

exports.checkEmail = async (req, res) => {
  const { email } = req.headers;
  const user = await User.findOne({ email }).exec();
  if (user) {
    res.json(null);
  } else res.json("ok");
};

exports.createOrUpdateUser = async (req, res) => {
  const user = await User.findOne({
    phoneNumber: req.user.phone_number,
  }).exec();

  if (!user) {
    const newUser = await new User({
      phoneNumber: req.user.phone_number,
      name: "Customer",
    }).save();
    res.json(newUser);
  } else {
    res.json(user);
  }

  //   const user = await User.findOneAndUpdate(
  //     { phoneNumber: },
  //     { name, phoneNumber: `+233${phoneNumber.slice(-9)}` },
  //     { new: true }
  //   );

  //   if (user) {
  //     console.log("USER UPDATED", user);
  //     res.json(user);
  //   } else {
  //     const newUser = await new User({
  //       email,
  //       name,
  //       phoneNumber: `+233${phoneNumber.slice(-9)}`,
  //     }).save();

  //     console.log("USER CREATED", newUser);
  //     res.json(newUser);
  //   }
};

exports.googleLogin = async (req, res) => {
  const { email } = req.user;

  console.log("Firebase userr at googlelogin------>", req.user);

  const user = await User.findOne({ email }).exec();

  if (user) {
    console.log("google login USER ", user);
    res.json(user);
  } else {
    const newUser = await new User({
      email,
      name: req.user.name,
      phoneNumber: req.user.phoneNumber
        ? `+233${req.user.phoneNumber.slice(-9)}`
        : "",
    }).save();

    console.log("Google USER CREATED---->", newUser);
    res.json(newUser);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email } = req.user;
    const user = await User.findOne({ email }).exec();
    res.json(user);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};

exports.currentUser = async (req, res) => {
  try {
    User.findOne({ phoneNumber: req.user.phone_number }).exec((err, user) => {
      if (err) throw new Error(err);
      else {
        console.log("Dbuser---->", user);
        res.json(user);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.currentAdmin = async (req, res) => {
  try {
    User.findOne({ email: req.user.email }).exec((err, user) => {
      if (err) throw new Error(err);
      else {
        console.log("Dbuser---->", user);
        res.json(user);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.currentStaff = async (req, res) => {
  try {
    User.findOne({ email: req.user.email }).exec((err, user) => {
      if (err) throw new Error(err);
      else {
        console.log("Dbuser---->", user);
        res.json(user);
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateUser = async (req, res) => {
  const _id = req.params.slug;
  try {
    const updatedUser = await User.findOneAndUpdate({ _id }, req.body, {
      new: true,
    }).exec();
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
