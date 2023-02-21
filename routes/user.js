const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const {
  getUser,
  addToNotificationList,
  updateUser,
  getOrders,
  uploadImage,
} = require("../controllers/user");

router.post("/get-user", authCheck, getUser);
router.post("/add-to-notification-list", addToNotificationList);
router.post("/update", authCheck, updateUser);
router.post("/get-orders", authCheck, getOrders);
router.post("/upload-image", authCheck, uploadImage);

module.exports = router;
