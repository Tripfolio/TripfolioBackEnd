const express = require("express")
const router = express.Router()
const {
  requestLinePayPayment,
  linePayConfirmCallback,
  checkPremiumStatus
} = require("../controllers/linePayController")

router.post("/request", requestLinePayPayment)
router.get("/confirm-callback", linePayConfirmCallback)
router.get("/check-status", checkPremiumStatus)

module.exports = router