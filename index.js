require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const { db } = require('./src/config/db');
const { travelSchedules } = require('./src/models/scheduleSchema');
const { eq } = require('drizzle-orm');

const authRoutes = require('./src/routes/authRoutes');
const protectedRoutes = require('./src/routes/protectedRoutes');
const memberRoutes = require('./src/routes/memberRoutes');
const itineraryRouter = require('./src/routes/itinerary');
const emailPreferencesRoute = require('./src/routes/emailPreferencesRoute');
const travelSchedulesRoutes = require('./src/routes/scheduleRoutes');
const updateScheduleRoutes = require('./src/routes/updateScheduleRoutes');
const communityRoutes = require('./src/routes/communityRoutes');
const loginRouter = require('./src/routes/loginRoutes');
const arriveItinerary = require('./src/routes/arriveItinerary');

app.use(
	cors({
		origin: process.env.VITE_API_URL,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		credentials: true,
	})
);

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api', loginRouter);
app.use('/api/members', memberRoutes);
app.use('/api/itinerary', itineraryRouter);
app.use('/api/email-preferences', emailPreferencesRoute);
app.use('/api/travelSchedule', travelSchedulesRoutes);
app.use('/api/updateScheduleRoutes', updateScheduleRoutes);
app.use('/api', communityRoutes);
app.use('/api/itineraryTime', arriveItinerary);

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', message: 'Backend is alive 🚀' });
});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
