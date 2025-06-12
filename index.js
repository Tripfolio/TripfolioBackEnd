const express = require("express");
const cors = require("cors");
const memberRoutes = require("./src/routes/memberRoutes");
const itineraryRouter = require("./src/routes/itinerary");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api", memberRoutes);

// app.put("/api/itinerary/places/reorder", (req, res) => {
//   console.log(req.body); // 應該能收到 { places: [...] }
//   // res.json({ success: true });
// });
app.use("/api/itinerary", itineraryRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
