const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const arriveItinerary = require("./src/routes/arriveItinerary");
const authRoutes = require("./src/routes/authRoutes"); 
const protectedRoutes = require("./src/routes/protectedRoutes");
const profileRoutes = require('./src/routes/profileRoutes');
const loginRouter = require('./src/routes/loginRoutes');
const itineraryRouter = require('./src/routes/itinerary');
const emailPreferencesRoute = require('./src/routes/emailPreferencesRoute'); 
const travelSchedulesRoutes = require('./src/routes/scheduleRoutes');

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use('/api', authRoutes); 
app.use('/api', protectedRoutes); 
app.use('/api/profile', profileRoutes);
app.use('/api', loginRouter);
app.use('/api/itinerary', itineraryRouter);
app.use("/uploads", express.static("uploads"));
app.use("/api/itineraryTime", arriveItinerary);
app.use("/api/email-preferences", emailPreferencesRoute);
app.use("/api/travelSchedule", travelSchedulesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
