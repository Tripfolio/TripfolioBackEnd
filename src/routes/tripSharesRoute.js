const express = require("express");
const router = express.Router();
const {
  shareTrip,
  getTripShareList,
  updateSharePermission,
  cancelShare,
  getInviteInfo,
  acceptShare,
  getMySharedTrips,
} = require("../controllers/tripSharesCtrl");
const { verifyShareToken } = require("../middlewares/shareMiddleware");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.post("/:tripId", authenticateToken, shareTrip);
router.get("/:tripId", authenticateToken, getTripShareList);
router.put("/:token", authenticateToken, updateSharePermission);
router.delete("/:token", authenticateToken, cancelShare);
router.get(
  "/:token/inviteInfo",
  authenticateToken,
  verifyShareToken("viewer"),
  getInviteInfo,
);
router.post(
  "/:token/accept",
  authenticateToken,
  verifyShareToken("viewer"),
  acceptShare,
);
router.get("/my-shared", authenticateToken, getMySharedTrips);

module.exports = router;
