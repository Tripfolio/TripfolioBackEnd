const express = require("express");
const router = express.Router();
const { checkPremiumStatus } = require("../controllers/paymentController");
const {
  linePayConfirm,
  linePayConfirmCallback,
} = require("../controllers/paymentController");

router.post("/confirm", linePayConfirm);
router.get("/confirm-callback", linePayConfirmCallback);
router.get("/check-status", checkPremiumStatus);

module.exports = router;