const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, staffCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const { updateOrder } = require("../controllers/order");

router.post("/update-order/:orderId", authCheck, staffCheck, updateOrder);

module.exports = router;
