const { tripShares } = require("../models/tripShares");
const { trips } = require("../models/trips"); //需確認有該檔案(行程資料)
const { users } = require("../models/users"); //需確認有該檔案(會員資料)
const { db } = require("../config/db");
const { v4: uuidv4 } = require("uuid");
const { eq } = require("drizzle-orm");

const shareTrip = async (req, res) => {
  const { tripId } = req.params;
  const { permission } = req.body;
  const userId = req.user.id;

  const trip = await db.query.trips.findFirst({
    where: (trips, { eq }) => eq(trips.id, tripId),
  });

  if (!trip) {
    return res.status(404).json({ message: "找不到該行程" });
  }

  if (trip.createdBy !== userId) {
    return res.status(403).json({ message: "你沒有權限分享這個行程" });
  }

  if (!["viewer", "editor"].includes(permission)) {
    return res.status(400).json({ message: "權限值無效" });
  }

  const token = uuidv4();

  await db.insert(tripShares).values({
    tripId,
    createdBy: userId,
    token,
    permission,
  });

  res.status(201).json({
    message: "分享成功",
    shareLink: `${process.env.SHARE_BASE_URL}/GetInvite/${token}`,
  });
};

const getTripShareList = async (req, res) => {
  const { tripId } = req.params;
  const currentUserId = req.user?.id;

  try {
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
      with: {
        user: true, // 關聯到使用者表，取得名字與頭像
      },
      columns: {
        token: true,
        permission: true,
        createdTime: true,
      },
    });

    const formatted = shareList.map((item) => ({
      token: item.token,
      permission: item.permission,
      name: item.user?.name || "未知使用者",
      avatarUrl: item.user?.avatarUrl,
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: "伺服器錯誤" });
  }
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

  await db
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

  await db
    .delete(tripShares)
    .where((tripShares, { eq }) => eq(tripShares.token, token));
  res.json({ message: "已成功取消分享" });
};

const getInviteInfo = async (req, res) => {
  const { token } = req.params;
  const userId = req.user?.id;

  try {
    const share = await db.query.tripShares.findFirst({
      where: (tripShares, { eq }) => eq(tripShares.token, token),
    });

    if (!share) {
      return res.status(404).json({ message: "分享連結不存在或已失效" });
    }

    const { tripId, permission, sharedWithUserId } = share;

    // 取得 trip 資料
    const trip = await db.query.trips.findFirst({
      where: (trips, { eq }) => eq(trips.id, tripId),
    });

    if (!trip) {
      return res.status(404).json({ message: "找不到對應的行程資料" });
    }

    // 主揪資料
    const owner = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, trip.createdBy),
    });

    const alreadyJoined = sharedWithUserId === userId;

    res.json({
      trip: {
        id: trip.id,
        title: trip.title,
        date: trip.date,
        ownerName: owner?.name || "主揪",
        permission,
      },
      alreadyJoined,
    });
  } catch (err) {
    res.status(500).json({ message: "伺服器錯誤" });
  }
};

const acceptShare = async (req, res) => {
  const { token } = req.params;
  const userId = req.user?.id;

  try {
    const share = await db.query.tripShares.findFirst({
      where: (tripShares, { eq }) => eq(tripShares.token, token),
    });

    if (!share) {
      return res.status(404).json({ message: "分享不存在或已失效" });
    }

    // 防止重複加入
    if (share.sharedWithUserId === userId) {
      return res.status(409).json({ message: "你已是共編者" });
    }

    // 更新這筆分享為你
    await db
      .update(tripShares)
      .set({ sharedWithUserId: userId })
      .where((tripShares, { eq }) => eq(tripShares.token, token));

    res.json({ message: "已成功加入共編者" });
  } catch (err) {
    res.status(500).json({ message: "伺服器錯誤" });
  }
};

module.exports = {
  shareTrip,
  getTripShareList,
  updateSharePermission,
  cancelShare,
  getInviteInfo,
  acceptShare,
};
