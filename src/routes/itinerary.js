const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/itinerary");

router.post("/add-place", ctrl.addPlace);
router.delete("/place", ctrl.deletePlace);
router.get("/places", ctrl.getPlaces);
router.put("/places/:id", ctrl.updateTime);

module.exports = router;
