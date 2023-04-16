const admin = require("../firebase");
const User = require("../models/User");

exports.authCheck = async (req, res, next) => {
  try {
    // await admin.auth().updateUser("qv15LgWwGxaZvJzbQTXcby5LrJz2", {
    //   email: "princebig12345@gmail.com",
    //   password: "@Important.1",
    // });
    const firebaseUser = await admin
      .auth()
      .verifyIdToken(req.headers.authtoken);
    console.log("FIREBASE USER IN AUTHCHECK", firebaseUser);
    req.user = firebaseUser;
    next();
  } catch (error) {
    console.log("Error======>", error);

    res.status(401).json({
      err: "Invalid or expired token",
    });
  }
};

exports.staffCheck = async (req, res, next) => {
  try {
    const { email } = await req.user;
    console.log(email);
    const staffUser = await User.findOne({ email }).exec();
    console.log("Staff===>", staffUser);

    if (staffUser.role === "staff" || staffUser.role === "admin") {
      next();
    } else {
      res.status(403).json({ error: "Unauthorized access!" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

exports.adminCheck = async (req, res, next) => {
  try {
    const { email } = await req.user;
    console.log(email);
    const adminUser = await User.findOne({ email }).exec();
    console.log("Admin===>", adminUser);

    if (adminUser.role === "admin") {
      next();
    } else {
      res.status(403).json({ error: "Unauthorized access!" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
