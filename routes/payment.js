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

router.post("/create-payment/:slug", createPayment);
router.post("/verify-transaction/:slug", verifyTransactionAndCreateOrder);
router.post("/paystack-webhook", handleWebhook);

module.exports = router;
