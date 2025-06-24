const { generateSignature, uuidv4 } = require("../utils/linePayUtils");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { db } = require("../config/db");
const { users } = require("../models/signUpSchema");
const { eq } = require("drizzle-orm");

const {
  LINEPAY_CHANNEL_ID,
  LINEPAY_SECRET,
  LINEPAY_CURRENCY,
  LINEPAY_AMOUNT,
  FRONTEND_URL,
  JWT_SECRET,
  LINEPAY_RETURN_HOST,
} = process.env;

const baseURL = import.meta.env.LINEPAY_BASE_URL;

exports.linePayConfirm = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const orderId = uuidv4();
    const nonce = uuidv4();

    const body = {
      amount: Number(LINEPAY_AMOUNT),
      currency: LINEPAY_CURRENCY,
      orderId,
      packages: [
        {
          id: "package-1",
          amount: Number(LINEPAY_AMOUNT),
          name: "Tripfolio Premium",
          products: [
            {
              name: "升級為付費會員",
              quantity: 1,
              price: Number(LINEPAY_AMOUNT),
            },
          ],
        },
      ],
      redirectUrls: {
        confirmUrl: `${LINEPAY_RETURN_HOST}/api/payment/confirm-callback?orderId=${orderId}&userId=${userId}`,
        cancelUrl: `${FRONTEND_URL}/payment-cancel`,
      },
    };

    const signature = generateSignature(
      LINEPAY_SECRET,
      "/v3/payments/request",
      body,
      nonce
    );

    const response = await axios.post(`${baseURL}/v3/payments/request`, body, {
      headers: {
        "Content-Type": "application/json",
        "X-LINE-ChannelId": LINEPAY_CHANNEL_ID,
        "X-LINE-Authorization-Nonce": nonce,
        "X-LINE-Authorization": signature,
      },
    });

    const data = response.data;

    if (data.returnCode !== "0000") {
      return res
        .status(500)
        .json({ message: `付款請求失敗：${data.returnMessage}` });
    }

    const paymentUrl = data?.info?.paymentUrl?.web;
    if (!paymentUrl) {
      return res.status(500).json({ message: "付款網址取得失敗" });
    }

    res.json({ url: paymentUrl });
  } catch (err) {
    res.status(500).json({ message: "付款初始化失敗" });
  }
};

exports.linePayConfirmCallback = async (req, res) => {
  const { transactionId, orderId, userId } = req.query;

  if (!transactionId || !orderId || !userId) {
    return res.redirect(`${FRONTEND_URL}/payment-fail`);
  }

  try {
    const confirmBody = {
      amount: Number(LINEPAY_AMOUNT),
      currency: LINEPAY_CURRENCY,
    };

    const nonce = uuidv4();
    const signature = generateSignature(
      LINEPAY_SECRET,
      `/v3/payments/${transactionId}/confirm`,
      confirmBody,
      nonce
    );

    const confirmRes = await axios.post(
      `${baseURL}/v3/payments/${transactionId}/confirm`,
      confirmBody,
      {
        headers: {
          "Content-Type": "application/json",
          "X-LINE-ChannelId": LINEPAY_CHANNEL_ID,
          "X-LINE-Authorization-Nonce": nonce,
          "X-LINE-Authorization": signature,
        },
      }
    );

    if (confirmRes.data.returnCode === "0000") {
      await db
        .update(users)
        .set({ isPremium: true })
        .where(eq(users.id, parseInt(userId)));

      return res.redirect(`${FRONTEND_URL}/payment-success`);
    } else {
      return res.redirect(`${FRONTEND_URL}/payment-fail`);
    }
  } catch (err) {
    return res.redirect(`${FRONTEND_URL}/payment-fail`);
  }
};

exports.checkPremiumStatus = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) {
      return res.status(404).json({ isPremium: false, message: "找不到使用者" });
    }

    res.json({ isPremium: user.isPremium });
  } catch (err) {
    res.status(500).json({ isPremium: false, message: "檢查會員狀態失敗" });
  }
};
