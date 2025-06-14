const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/arriveItinerary");

router.put("/places/:id", ctrl.updateArriveTime);

module.exports = router;
