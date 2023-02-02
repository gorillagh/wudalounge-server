const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const {
  addToNotificationList,
  updateUser,
  getOrders,
} = require("../controllers/user");

router.post("/add-to-notification-list", addToNotificationList);
router.post("/update/:slug", updateUser);
router.get("/get-orders/:slug", getOrders);

module.exports = router;
