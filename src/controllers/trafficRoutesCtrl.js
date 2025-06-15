const { getTrafficData, handleNewPlaceAdded, updateTrafficAfterReorder } = require('./trafficData');

async function getTraffic(req, res) {
  const { from, to, mode } = req.query;
  if (!from || !to || !mode) {
    return res.status(400).json({ success: false, message: '缺少必要參數' });
  }
  try {
    const traffic = await getTrafficData(from, to, mode);
    if (!traffic) {
      return res.json({ duration: null, distance: null });
    }
    res.json({
      duration: traffic.duration,
      distance: traffic.distance
    });
  } catch (err) {
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
}

async function addTraffic(req, res) {
    const { itineraryId, newPlaceId, prevPlaceId, fromAddress, toAddress } = req.body;
    if (!itineraryId || !newPlaceId || !prevPlaceId || !fromAddress || !toAddress) {
        return res.status(400).json({ success: false, message: '缺少必要參數' });
    }

  try {
    await handleNewPlaceAdded(itineraryId, newPlaceId, prevPlaceId, fromAddress, toAddress);
    res.json({ success: true });
  } catch (err) {
    console.error('加入交通失敗:', err);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
}

async function reorderTraffic(req, res) {
  const { itineraryId, orderedPlaces } = req.body;
  if (!itineraryId || !Array.isArray(orderedPlaces)) {
    return res.status(400).json({ success: false, message: '缺少必要參數' });
  }

  try {
    await updateTrafficAfterReorder(itineraryId, orderedPlaces);
    res.json({ success: true });
  } catch (err) {
    console.error('重建交通失敗:', err);
    res.status(500).json({ success: false, message: '伺服器錯誤' });
  }
}


module.exports = { addTraffic, reorderTraffic, getTraffic };
