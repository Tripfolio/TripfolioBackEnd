const express = require("express");
const cors = require("cors");
const memberRoutes = require("./src/routes/memberRoutes");
const itineraryRouter = require("./src/routes/itinerary");
const arriveItinerary = require("./src/routes/arriveItinerary");
const app = express();

require("dotenv").config();



const authRoutes = require("./src/routes/authRoutes"); 
const protectedRoutes = require("./src/routes/protectedRoutes"); 
const memberRoutes = require('./src/routes/memberRoutes');
const itineraryRouter = require('./src/routes/itinerary');
const emailPreferencesRoute = require('./src/routes/emailPreferencesRoute'); 
const travelSchedulesRoutes = require('./src/routes/scheduleRoutes');

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], 
  credentials: true 
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/api/itineraryTime", arriveItinerary);
app.use("/api/itinerary", itineraryRouter);
app.use('/api', authRoutes); 
app.use('/api', protectedRoutes); 
app.use('/api/members', memberRoutes);
app.use("/api/email-preferences", emailPreferencesRoute);
app.use('/api/travelSchedule', travelSchedulesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
