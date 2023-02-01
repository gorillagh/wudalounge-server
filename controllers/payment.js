const User = require("../models/User");
const axios = require("axios");
const discount = 0.5;

exports.createPayment = async (req, res) => {
  try {
    let total = 0;
    let totalAfterDiscount = 0;
    const _id = req.params.slug;
    const { dishes, deliveryMode, riderTip, paymentMethod } = req.body;
    const { phoneNumber, addresses, name, email } = await User.findOne({
      _id,
    }).exec();

    if (dishes) {
      dishes.map((d, index) => {
        let totalExtras = 0;
        for (var i in d.extras) {
          if (d.extras[i].checked)
            totalExtras =
              totalExtras +
              Number(d.extras[i].additionalAmount) *
                Number(d.extras[i].quantity);
        }

        const subTotal =
          Number(d.dishQuantity) *
          (Number(d.price) +
            Number(d.selectedSize.additionalAmount) +
            Number(totalExtras));

        total += subTotal;
        totalAfterDiscount += subTotal - discount * subTotal;
      });
      if (riderTip && deliveryMode === "delivery") {
        total += riderTip;
        totalAfterDiscount += riderTip;
      }
    }

    res.json({ total, totalAfterDiscount });
  } catch (error) {
    console.log(error);
  }
};

exports.verifyTransactionAndCreateOrder = async (req, res) => {
  try {
    const _id = req.params.slug;
    const { dishes, deliveryMode, riderTip, paymentMethod } = req.body.data;
    const { transaction } = req.body;
    const { phoneNumber, addresses, name, email } = await User.findOne({
      _id,
    }).exec();
    const verifiedTransaction = await axios.get(
      `https://api.paystack.co/transaction/verify/${transaction.reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACk_TEST_SECRET_KEY}`,
        },
      }
    );
    console.log("Transaction verification---->", verifiedTransaction.data);
    if (
      verifiedTransaction &&
      verifiedTransaction.data.data.status === "success"
    ) {
      res.json("confirmed!");
    }
  } catch (error) {
    console.log(error);
  }
};
