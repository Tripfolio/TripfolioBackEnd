const express = require("express");
const router = express.Router();
const {
  linePayConfirm,
  linePayConfirmCallback,
} = require("../controllers/paymentController");

router.post("/confirm", linePayConfirm);
router.get("/confirm-callback", linePayConfirmCallback);

module.exports = router;