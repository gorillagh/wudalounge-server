const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const { getOrders } = require("../controllers/admin");

router.post("/admin/orders", authCheck, adminCheck, getOrders);

module.exports = router;
