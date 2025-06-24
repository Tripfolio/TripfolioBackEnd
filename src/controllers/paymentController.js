const { db } = require('../config/db');
const { users } = require('../models/usersSchema');
const { eq } = require('drizzle-orm');
const braintree = require('braintree');
const HTTP = require('../constants/httpStatus');
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BT_MERCHANT_ID,
  publicKey: process.env.BT_PUBLIC_KEY,
  privateKey: process.env.BT_PRIVATE_KEY,
});

const generateClientToken = async (req, res) => {
  try {
    const result = await gateway.clientToken.generate({});
    res.json({ token: result.clientToken, amount: '30.0' });
  } catch (err) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json({ message: '產生 Client Token 失敗', error: err.message });
  }
};

const confirmPayment = async (req, res) => {
  const nonce = req.body.paymentMethodNonce;
  const userId = req.user.id;

  try {
    const result = await gateway.transaction.sale({
      amount: '30.0',
      paymentMethodNonce: nonce,
      options: { submitForSettlement: true },
    });

    if (result.success) {
      if (userId) {
        await db.update(users).set({ isPremium: true }).where(eq(users.id, userId));
      }

      res.json({
        success: true,
        message: '付款成功，您已經升級為付費會員',
        transaction: result.transaction,
      });
    } else {
      res.status(HTTP.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: result.message,
      });
    }
  } catch (err) {
    res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: '付款失敗', error: err.message });
  }
};

module.exports = {
  generateClientToken,
  confirmPayment,
};
