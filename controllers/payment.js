const User = require("../models/User");
const Order = require("../models/Order");
const axios = require("axios");
const discount = 0.5;
const { v4: uuid } = require("uuid");
const crypto = require("crypto");

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
    const id = req.params.slug;
    const { dishes, deliveryMode, riderTip, paymentMethod, notes } =
      req.body.data;
    const { transaction } = req.body;
    const { _id, phoneNumber, addresses } = await User.findOne({
      _id: id,
    }).exec();

    if (paymentMethod && paymentMethod === "cash") {
      let total = 0;
      let totalAfterDiscount = 0;
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
      const reference = uuid();
      const newOrder = await new Order({
        reference,
        dishes,
        orderedBy: _id,
        address: addresses[0],
        phoneNumber,
        deliveryMode,
        riderTip,
        paymentMethod,
        notes,
        paymentIntent: {
          reference,
          amount: totalAfterDiscount * 100,
          channel: "cash",
        },
      }).save();
      res.json("Order placed");
      return;
    }
    const orderExists = await Order.findOne({
      reference: transaction.reference,
    }).exec();
    if (orderExists) {
      console.log("Order already exists");
      res.json("Payment Confirmed and Order Created");
      return;
    }

    const verifiedTransaction = await axios.get(
      `https://api.paystack.co/transaction/verify/${transaction.reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_TEST_SECRET_KEY}`,
        },
      }
    );
    console.log("Transaction verification---->", verifiedTransaction.data);
    if (
      verifiedTransaction &&
      verifiedTransaction.data.data.status === "success"
    ) {
      const newOrder = await new Order({
        reference: verifiedTransaction.data.data.reference,
        dishes,
        orderedBy: _id,
        address: addresses[0],
        phoneNumber,
        deliveryMode,
        riderTip,
        paymentMethod,
        notes,
        paymentIntent: verifiedTransaction.data.data,
      }).save();
      res.json("Payment Confirmed and Order Created");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.handleWebhook = async (req, res) => {
  try {
    //Validate event
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_TEST_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");
    if (hash == req.headers["x-paystack-signature"]) {
      // Retrieve the request's body
      const event = req.body;
      if (event.event === "charge.success") {
        const orderExists = await Order.findOne({
          reference: event.data.reference,
        }).exec();

        if (orderExists) {
          console.log("Order Exists(from webhook)-------->", orderExists);
          res.send(200);
          return;
        }
        if (!orderExists) {
          const phoneNumber = event.data.metadata.phone;
          const { _id, addresses } = await User.findOne({
            phoneNumber,
          }).exec();
          const { dishes, deliveryMode, riderTip, paymentMethod, notes } =
            event.data.metadata.cart;
          const newOrder = await new Order({
            reference: event.data.reference.toString(),
            dishes,
            orderedBy: _id,
            address: addresses[0],
            phoneNumber,
            deliveryMode,
            riderTip,
            paymentMethod,
            notes,
            paymentIntent: {
              reference: event.data.reference.toString(),
              amount: event.data.amount,
              channel: event.data.channel,
              authorization: event.data.authorization,
              createdBy: "Webhook",
            },
          }).save();
          console.log("Stack ORDER SAVED----->>", newOrder);
          res.send(200);
        } else {
          res.json({ ok: false });
        }
      } else {
        res.json({ ok: false });
      }
    } else {
      res.json({ ok: false });
    }
  } catch (error) {
    console.log(error);
  }
};
