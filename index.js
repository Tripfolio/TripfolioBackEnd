const express = require('express');
const cors = require('cors');
const memberRoutes = require('./src/routes/memberRoutes');
const itineraryRouter = require('./src/routes/itinerary');
const emailPreferencesRoute = require('./src/routes/emailPreferencesRoute');
const authRouter = require('./src/routes/authRoutes'); 
const travelSchedulesRoutes = require('./src/routes/scheduleRoutes');

const app = express();
require('dotenv').config();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/members', memberRoutes);
app.use('/api/itinerary', itineraryRouter);
app.use("/api/email-preferences", emailPreferencesRoute);
app.use('/api', authRouter); 
app.use('/api/travelSchedule', travelSchedulesRoutes);


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})