const express = require("express");
const router = express.Router();
const {
  shareTrip,
  getTripShareList,
  updateSharePermission,
  cancelShare,
  viewSharedTrip,
  editSharedTrip,
} = require("../controllers/tripSharesCtrl");
const verifyShareToken = require("../middlewares/shareMiddleware");
const authenticateToken = require("..middlewares/authMiddleware"); //需確認有該檔案

router.post("/:tripId", authenticateToken, shareTrip);
router.get("/:tripId", authenticateToken, getTripShareList);
router.put("/:token", authenticateToken, updateSharePermission);
router.delete("/:token", authenticateToken, cancelShare);
router.get(
  "/:token/getShared",
  authenticateToken,
  verifyShareToken("viewer"),
  viewSharedTrip
);
router.put(
  "/:token/getShared",
  authenticateToken,
  verifyShareToken("editor"),
  editSharedTrip
);

module.exports = router;
