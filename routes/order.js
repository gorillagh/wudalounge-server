const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const { updateOrder } = require("../controllers/order");

router.post("/update-order/:orderId", authCheck, adminCheck, updateOrder);

module.exports = router;
