const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, staffCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const {
  getOrders,
  getDashboardBriefs,
  uploadDishImage,
  createMenu,
  getDishSubs,
  getAllOrders,
  getUsers,
  updateUser,
  getRevenueChartData,
} = require("../controllers/admin");
const { getAllReports } = require("../controllers/staff");

router.post(
  "/admin/dashboard-briefs",
  authCheck,
  adminCheck,
  getDashboardBriefs
);
router.post(
  "/admin/revenue-chart-data",
  authCheck,
  adminCheck,
  getRevenueChartData
);

router.post("/admin/upload-dish-image", authCheck, adminCheck, uploadDishImage);
router.post("/admin/create-menu", authCheck, adminCheck, createMenu);
router.post("/admin/get-dish-subs", authCheck, adminCheck, getDishSubs);
router.post("/admin/orders", authCheck, adminCheck, getAllOrders);
router.post("/admin/reports", authCheck, staffCheck, getAllReports);
router.post("/admin/users", authCheck, adminCheck, getUsers);
router.post("/admin/user-update/:userId", authCheck, adminCheck, updateUser);
module.exports = router;
