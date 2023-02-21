const express = require("express");

const router = express.Router();

//Middlewares
const { authCheck, adminCheck } = require("../middlewares/auth");

//Controllers
const {
  createPayment,
  verifyTransactionAndCreateOrder,
  handleWebhook,
} = require("../controllers/payment");

router.post("/create-payment", authCheck, createPayment);
router.post("/verify-transaction", authCheck, verifyTransactionAndCreateOrder);
router.post("/paystack-webhook", handleWebhook);

module.exports = router;
