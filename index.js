require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { db } = require('./src/config/db');
const { travelSchedules } = require('./src/models/scheduleSchema');
const { eq } = require('drizzle-orm');

const memberRoutes = require('./src/routes/memberRoutes');
const itineraryRouter = require('./src/routes/itinerary');
const emailPreferencesRoute = require('./src/routes/emailPreferencesRoute');
const updateScheduleRoutes = require('./src/routes/updateScheduleRoutes');
const scheduleRoutes = require('./src/routes/scheduleRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api', memberRoutes);
app.use('/api/itinerary', itineraryRouter);
app.use("/api/email-preferences", emailPreferencesRoute);
app.use('/api/updateScheduleRoutes', updateScheduleRoutes);
app.use('/api/travelSchedule', scheduleRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});