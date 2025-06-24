const { tripShares } = require("../models/tripShares");
const { travelSchedules } = require("../models/scheduleSchema");
const { db } = require("../config/db");
const { eq } = require("drizzle-orm");

/**
 * @param {'viewer' | 'editor'} requiredPermission
 */
function verifyShareToken(requiredPermission) {
  return async function (req, res, next) {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    try {
      // 查詢 token 對應的共享資訊
      const sharedTripRows = await db
        .select()
        .from(tripShares)
        .where(eq(tripShares.token, token))
        .limit(1);

      const sharedTrip = sharedTripRows[0];

      if (!sharedTrip) {
        return res.status(404).json({ error: "Shared trip not found" });
      }

      // 查詢對應的 trip（為了驗證主揪）
      const tripRows = await db
        .select()
        .from(travelSchedules)
        .where(eq(travelSchedules.id, sharedTrip.tripId))
        .limit(1);

      const trip = tripRows[0];

      if (!trip) {
        return res.status(404).json({ error: "Trip not found" });
      }

      // 確保使用者已登入（authMiddleware 應先執行）
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const userId = req.user.id;

      // 若為行程建立者，直接通過驗證
      if (trip.createdBy === userId) {
        req.sharedTrip = {
          tripId: trip.id,
          sharedWithUserId: userId,
          permission: "owner",
        };
        return next();
      }

      // 檢查是否為被授權的共享對象
      if (sharedTrip.sharedWithUserId !== userId) {
        return res
          .status(403)
          .json({ error: "Access denied: not the shared user" });
      }

      // 權限驗證
      if (
        requiredPermission === "editor" &&
        sharedTrip.permission !== "editor"
      ) {
        return res.status(403).json({ error: "Insufficient permission" });
      }

      // 傳入共享資訊給後續 controller 使用
      req.sharedTrip = {
        tripId: sharedTrip.tripId,
        sharedWithUserId: sharedTrip.sharedWithUserId,
        permission: sharedTrip.permission,
      };

      next();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
}

module.exports = { verifyShareToken };
