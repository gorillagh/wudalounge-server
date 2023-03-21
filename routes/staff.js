const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, staffCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const {
  getDashboardBriefs,
  getAllOrders,
  getAllReports,
} = require("../controllers/staff");

router.post(
  "/staff/dashboard-briefs",
  authCheck,
  adminCheck,
  getDashboardBriefs
);

router.post("/staff/orders", authCheck, staffCheck, getAllOrders);
router.post("/staff/reports", authCheck, staffCheck, getAllReports);

module.exports = router;
