const express = require("express");
const cors = require("cors");
<<<<<<< HEAD
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
=======
const dotenv = require('dotenv');
dotenv.config(); 
const app = express();
const PORT = process.env.PORT;

const authRoutes = require("./src/routes/authRoutes"); 
const protectedRoutes = require("./src/routes/protectedRoutes"); 
const memberRoutes = require('./src/routes/memberRoutes');
const itineraryRouter = require('./src/routes/itinerary');
const emailPreferencesRoute = require('./src/routes/emailPreferencesRoute'); 
const travelSchedulesRoutes = require('./src/routes/scheduleRoutes');
const communityRoutes = require('./src/routes/communityRoutes');
const loginRouter = require('./src/routes/loginRoutes');
const arriveItinerary = require("./src/routes/arriveItinerary");

app.use(
  cors({
    origin: process.env.VITE_API_URL,
>>>>>>> 415e4087980314d006893aecad142b2c4a91d748
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
<<<<<<< HEAD
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
=======
app.use('/uploads', express.static('uploads'));
app.use('/api', authRoutes); 
app.use('/api', protectedRoutes); 
app.use('/api', loginRouter);
app.use('/api/members', memberRoutes);
app.use('/api/itinerary', itineraryRouter);
app.use("/api/email-preferences", emailPreferencesRoute);
app.use('/api/travelSchedule', travelSchedulesRoutes);
app.use('/api', communityRoutes);
app.use("/api/itineraryTime", arriveItinerary);

>>>>>>> 415e4087980314d006893aecad142b2c4a91d748
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
