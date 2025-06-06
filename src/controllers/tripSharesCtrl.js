const { tripShares } = require("../models/tripShares");
const { trips } = require("../models/trips"); //需確認有該檔案(行程資料)
const { db } = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const { eq } = require("drizzle-orm");

const shareTrip = async (req, res) => {
  const { tripId } = req.params;
  const { sharedWithUserId, permission } = req.body;
  const sharedByUserId = req.user?.id;

  const trip = await db.query.trips.findFirst({
    where: (trips, { eq }) => eq(trips.id, tripId),
  });

  if (!trip) {
    return res.status(404).json({ message: "找不到該行程" });
  }

  if (trip.createdBy !== sharedByUserId) {
    return res.status(403).json({ message: "你沒有權限分享這個行程" });
  }

  if (!["viewer", "editor"].includes(permission)) {
    return res.status(400).json({ message: "權限值無效" });
  }

  const existingShare = await db.query.tripShares.findFirst({
    where: (tripShares, { and, eq }) =>
      and(
        eq(tripShares.tripId, tripId),
        eq(tripShares.sharedWithUserId, sharedWithUserId)
      ),
  });

  if (existingShare) {
    return res.status(409).json({ message: "已經分享給該使用者" });
  }

  const token = uuidv4();

  await db.insert(tripShares).values({
    tripId,
    sharedWithUserId,
    sharedByUserId,
    permission,
    token,
  });

  res.status(201).json({
    message: "分享成功",
    shareLink: `${process.env.SHARE_BASE_URL}/Link/${token}`,
  });
};

const getTripShareList = async (req, res) => {
  const { tripId } = req.params;
  const currentUserId = req.user?.id;

  const trip = await db.query.trips.findFirst({
    where: (trips, { eq }) => eq(trips.id, tripId),
  });

  if (!trip) {
    return res.status(404).json({ message: "找不到該行程" });
  }

  if (trip.createdBy !== currentUserId) {
    return res.status(403).json({ message: "你沒有權限查看此分享清單" });
  }
  const shareList = await db.query.tripShares.findMany({
    where: (tripShares, { eq }) => eq(tripShares.tripId, tripId),
    columns: {
      sharedWithUserId: true,
      permission: true,
      createdTime: true,
    },
  });
  res.json(shareList);
};

const updateSharePermission = async (req, res) => {
  const { token } = req.params;
  const { permission } = req.body;
  const currentUserId = req.user?.id;

  if (!["viewer", "editor"].includes(permission)) {
    return res.status(400).json({ message: "無效的權限值" });
  }
  const share = await db.query.tripShares.findFirst({
    where: (tripShares, { eq }) => eq(tripShares.token, token),
    with: {
      trip: true,
    },
  });

  if (!share) {
    return res.status(404).json({ message: "找不到分享資料" });
  }

  if (share.trip.createdBy !== currentUserId) {
    return res.status(403).json({ message: "你沒有權限修改此分享" });
  }

  const result = await db
    .update(tripShares)
    .set({ permission })
    .where((tripShares, { eq }) => eq(tripShares.token, token));

  res.json({ message: "已更新權限" });
};

const cancelShare = async (req, res) => {
  const { token } = req.params;
  const currentUserId = req.user?.id;

  const share = await db.query.tripShares.findFirst({
    where: (tripShares, { eq }) => eq(tripShares.token, token),
    with: {
      trip: true,
    },
  });

  if (!share) {
    return res.status(404).json({ message: "找不到分享資料" });
  }

  if (share.trip.createdBy !== currentUserId) {
    return res.status(403).json({ message: "你沒有權限取消此分享" });
  }

  const result = await db
    .delete(tripShares)
    .where((tripShares, { eq }) => eq(tripShares.token, token));
  res.json({ message: "已成功取消分享" });
};

const viewSharedTrip = async (req, res) => {
  try {
    const { tripId } = req.sharedTrip;

    const tripRows = await db
      .select()
      .from(trips)
      .where(eq(trips.id, tripId))
      .limit(1);

    const trip = tripRows[0];

    if (!trip) {
      return res.status(404).json({ error: "找不到該行程" });
    }

    res.json({ trip });
  } catch (error) {
    console.error("viewSharedTrip error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT /api/trip-shares/by-token/:token（已驗證 token + 登入 + editor 權限）
const editSharedTrip = async (req, res) => {
  try {
    const { tripId } = req.sharedTrip;
    const updatedData = req.body;

    const result = await db
      .update(trips)
      .set(updatedData)
      .where(eq(trips.id, tripId));

    res.json({ success: true, message: "行程編輯成功" });
  } catch (error) {
    console.error("editSharedTrip error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  shareTrip,
  getTripShareList,
  updateSharePermission,
  cancelShare,
  viewSharedTrip,
  editSharedTrip,
};
