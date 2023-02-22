const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const {
  getOrders,
  getDashboardBriefs,
  uploadDishImage,
} = require("../controllers/admin");

router.post("/admin/orders", authCheck, adminCheck, getOrders);
router.post(
  "/admin/dashboard-briefs",
  authCheck,
  adminCheck,
  getDashboardBriefs
);
router.post("/admin/upload-dish-image", authCheck, adminCheck, uploadDishImage);

module.exports = router;
