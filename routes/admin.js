const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const { getOrders, getDashboardBriefs } = require("../controllers/admin");

router.post("/admin/orders", authCheck, adminCheck, getOrders);
router.post(
  "/admin/dashboard-briefs",
  authCheck,
  adminCheck,
  getDashboardBriefs
);

module.exports = router;
