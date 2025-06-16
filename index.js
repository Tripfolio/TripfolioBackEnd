const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config(); 

const app = express();
const arriveItinerary = require("./src/routes/arriveItinerary");
const authRoutes = require("./src/routes/authRoutes");
const protectedRoutes = require("./src/routes/protectedRoutes");
const memberRoutes = require("./src/routes/memberRoutes");
const itineraryRouter = require("./src/routes/itinerary");
const emailPreferencesRoute = require("./src/routes/emailPreferencesRoute");
const travelSchedulesRoutes = require("./src/routes/scheduleRoutes");
const trafficRoutes = require("./src/routes/trafficData");

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], 
  credentials: true 
}));

app.use(express.json());
// app.use('/uploads', express.static('uploads')); 
// app.use('/api', authRoutes); 
// app.use('/api', protectedRoutes); 
// app.use('/api/members', memberRoutes);
app.use('/api/itinerary', itineraryRouter);
// app.use("/api/email-preferences", emailPreferencesRoute);
// app.use("/api/travelSchedule", travelSchedulesRoutes);
app.use("/api/itineraryTime", arriveItinerary);
app.use("/api/traffic", trafficRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

