const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const {
  getOrders,
  getDashboardBriefs,
  uploadDishImage,
  createMenu,
  getDishSubs,
} = require("../controllers/admin");

router.post("/admin/orders", authCheck, adminCheck, getOrders);
router.post(
  "/admin/dashboard-briefs",
  authCheck,
  adminCheck,
  getDashboardBriefs
);
router.post("/admin/upload-dish-image", authCheck, adminCheck, uploadDishImage);
router.post("/admin/create-menu", authCheck, adminCheck, createMenu);
router.post("/admin/get-dish-subs", authCheck, adminCheck, getDishSubs);

module.exports = router;
