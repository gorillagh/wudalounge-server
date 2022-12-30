const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const { addToNotificationList } = require("../controllers/user");

router.post("/add-to-notification-list", addToNotificationList);

module.exports = router;
