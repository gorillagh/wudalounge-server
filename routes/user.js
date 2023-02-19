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

router.get("/get-user/:slug", getUser);
router.post("/add-to-notification-list", addToNotificationList);
router.post("/update/:slug", updateUser);
router.get("/get-orders/:slug", getOrders);
router.post("/upload-image/:slug", uploadImage);

module.exports = router;
