const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const {
  createPayment,
  verifyTransactionAndCreateOrder,
} = require("../controllers/payment");

router.post("/create-payment/:slug", createPayment);
router.post("/verify-transaction/:slug", verifyTransactionAndCreateOrder);

module.exports = router;
