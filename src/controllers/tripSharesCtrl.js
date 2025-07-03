const { tripShares } = require('../models/tripSharesSchema');
const { sharedUsers } = require('../models/tripSharesSchema');
const { users } = require('../models/usersSchema');
const { schedules } = require('../models/scheduleSchema');
const { db } = require('../config/db');
const { eq, desc, inArray } = require('drizzle-orm');
const { v4: uuidv4 } = require('uuid');

const createShareLink = async (req, res) => {
  const userId = req.user?.id; // 已通過 JWT 驗證 middleware
  const { tripId } = req.params;
  const { permission } = req.body; // 'viewer' or 'editor'

  try {
    // 產生唯一 token
    const token = uuidv4();

    // 設定過期時間（例如 24 小時後）
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // 新增資料到 tripShares
    const result = await db.insert(tripShares).values({
      tripId: parseInt(tripId),
      token,
      permission,
      expiresAt,
    });

    // 組成可分享的網址
    const shareUrl = `${process.env.VITE_API_URL}/share/${token}`;

    return res.status(201).json({
      success: true,
      shareUrl,
      token,
      permission,
      expiresAt,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
};

const getSharedUsers = async (req, res) => {
  const userId = req.user.id;
  const { tripId } = req.params;

  try {
    // 查 trip 是否存在
    const trip = await db
      .select()
      .from(schedules)
      .where(eq(schedules.id, parseInt(tripId)));

    if (!trip || trip.length === 0) {
      return res.status(404).json({ success: false, message: '找不到行程' });
    }

    const isOwner = trip[0].userId === userId;

    // 查共享清單
    const result = await db
      .select({
        id: sharedUsers.userId,
        role: sharedUsers.role,
        email: users.email,
        name: users.name,
      })
      .from(sharedUsers)
      .innerJoin(users, eq(users.id, sharedUsers.userId))
      .where(eq(sharedUsers.tripId, parseInt(tripId)));

    // 查 trip 擁有者資料（❗不要把 'owner' 當成 literal）
    const ownerRow = await db
      .select({
        id: users.id,
        role: users.id, // placeholder，等下會手動加上 role
        email: users.email,
        name: users.name,
      })
      .from(users)
      .where(eq(users.id, trip[0].userId));

    const tripOwner = ownerRow.length
      ? [{ ...ownerRow[0], role: 'owner' }] // ✅ 手動加上 'owner' 字串
      : [];

    // 避免重複加入 owner
    const filtered = result.filter((u) => u.id !== trip[0].userId);
    const uniqueResult = [...filtered, ...tripOwner];

    return res.status(200).json({ success: true, data: uniqueResult, isOwner });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};

const updateUserPermission = async (req, res) => {
  const { targetUserId, tripId, newRole } = req.body;
  const requesterId = req.user.id;

  try {
    // 驗證是否為建立者
    const trip = await db
      .select()
      .from(schedules)
      .where(eq(schedules.id, parseInt(tripId)));
    if (!trip.length || trip[0].userId !== requesterId) {
      return res.status(403).json({ success: false, message: '你沒有權限變更共享權限' });
    }

    await db
      .update(sharedUsers)
      .set({ role: newRole })
      .where(
        eq(sharedUsers.tripId, parseInt(tripId)),
        eq(sharedUsers.userId, parseInt(targetUserId)),
      );

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};

const removeSharedUser = async (req, res) => {
  const requesterId = req.user.id;
  const { userId, tripId } = req.params;

  try {
    const trip = await db
      .select()
      .from(schedules)
      .where(eq(schedules.id, parseInt(tripId)));
    if (!trip.length || trip[0].userId !== requesterId) {
      return res.status(403).json({ success: false, message: '你沒有權限' });
    }

    await db
      .delete(sharedUsers)
      .where(eq(sharedUsers.tripId, parseInt(tripId)), eq(sharedUsers.userId, parseInt(userId)));

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};

//驗證 & 授權 API
const handleShareToken = async (req, res) => {
  const userId = req.user?.id; // 登入驗證

  const { token } = req.params;

  try {
    // 查詢 token 是否存在 + 過期驗證
    const result = await db.select().from(tripShares).where(eq(tripShares.token, token));

    if (!result.length) {
      return res.status(404).json({ success: false, message: '無效或過期的分享連結' });
    }

    const shareEntry = result[0];

    if (new Date(shareEntry.expiresAt) < new Date()) {
      return res.status(403).json({ success: false, message: '分享連結已過期' });
    }

    // 檢查該使用者是否已存在 sharedUsers 中
    const exist = await db
      .select()
      .from(sharedUsers)
      .where(eq(sharedUsers.tripId, shareEntry.tripId), eq(sharedUsers.userId, userId));

    if (!exist.length) {
      // 第一次存取 → 加入共享清單
      await db.insert(sharedUsers).values({
        tripId: shareEntry.tripId,
        userId,
        role: shareEntry.permission,
      });
    }

    // 回傳 tripId 給前端導向正確頁面
    return res.status(200).json({
      success: true,
      tripId: shareEntry.tripId,
      role: shareEntry.permission,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: '伺服器錯誤',
      error: err.message,
      stack: err.stack,
    });
  }
};

//取得自己建立的行程以及與他人共享的行程
const getMyTripsAndShared = async (req, res) => {
  const userId = req.user.id;

  try {
    // 自己建立的行程
    const myTrips = await db
      .select({
        id: schedules.id,
        userId: schedules.userId,
        title: schedules.title,
        startDate: schedules.startDate,
        endDate: schedules.endDate,
        description: schedules.description,
        coverURL: schedules.coverURL,
        createdAt: schedules.createdAt,
      })
      .from(schedules)
      .where(eq(schedules.userId, userId))
      .orderBy(desc(schedules.createdAt));

    // 透過共享加入的行程 ID
    const sharedTripIdsResult = await db
      .select({ tripId: sharedUsers.tripId })
      .from(sharedUsers)
      .where(eq(sharedUsers.userId, userId));

    const sharedTripIds = sharedTripIdsResult.map((row) => row.tripId);

    // 取得被共享的行程內容
    const sharedTrips = sharedTripIds.length
      ? await db
          .select({
            id: schedules.id,
            userId: schedules.userId,
            title: schedules.title,
            startDate: schedules.startDate,
            endDate: schedules.endDate,
            description: schedules.description,
            coverURL: schedules.coverURL,
            createdAt: schedules.createdAt,
          })
          .from(schedules)
          .where(inArray(schedules.id, sharedTripIds))
          .orderBy(desc(schedules.createdAt))
      : [];

    const allTrips = [...myTrips, ...sharedTrips];

    return res.status(200).json({
      success: true,
      schedules: [...myTrips, ...sharedTrips],
    });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};

const getTripPermission = async (req, res) => {
  const userId = req.user.id;
  const tripId = parseInt(req.params.id);
  const tripIdParam = req.params.id;

  if (isNaN(tripId)) {
    return res.status(400).json({
      success: false,
      message: '無效的行程ID',
      error: `Invalid tripId: ${tripIdParam}`, // 把原始的參數也印出來
    });
  }

  try {
    const trip = await db.select().from(schedules).where(eq(schedules.id, tripId));

    if (!trip.length) {
      return res.status(404).json({ success: false, message: '行程不存在' });
    }

    // 自己建立的行程
    if (trip[0].userId === userId) {
      return res.status(200).json({ success: true, role: 'owner' });
    }

    // 查詢是否為被共享的使用者
    const shared = await db
      .select()
      .from(sharedUsers)
      .where(eq(sharedUsers.tripId, tripId), eq(sharedUsers.userId, userId));

    if (shared.length > 0) {
      return res.status(200).json({ success: true, role: shared[0].role }); // viewer 或 editor
    }

    // 沒有權限
    return res.status(403).json({ success: false, message: '無權限' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, stack: err.stack });
  }
};

module.exports = {
  createShareLink,
  getSharedUsers,
  updateUserPermission,
  removeSharedUser,
  handleShareToken,
  getMyTripsAndShared,
  getTripPermission,
};
