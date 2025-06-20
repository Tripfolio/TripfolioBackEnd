require('dotenv').config(); //這個擺第一行，不要亂換

const express = require("express");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const app = express(); //初始化express擺這裡不要亂換

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tripfolio API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'],
};

const arriveItinerary = require("./src/routes/arriveItinerary");
const authRoutes = require("./src/routes/authRoutes"); 
const protectedRoutes = require("./src/routes/protectedRoutes");
const profileRoutes = require('./src/routes/profileRoutes');
const loginRouter = require('./src/routes/loginRoutes');
const itineraryRouter = require('./src/routes/itinerary');
const emailPreferencesRoute = require('./src/routes/emailPreferencesRoute');
const travelSchedulesRoutes = require('./src/routes/scheduleRoutes');
const updateScheduleRoutes = require('./src/routes/updateScheduleRoutes');
const communityRoutes = require('./src/routes/communityRoutes');
const tripSharesRoute = require("./src/routes/tripSharesRoute");

app.use(
	cors({
		origin: process.env.VITE_API_URL,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		credentials: true,
	})
);
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/signup', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/login', loginRouter);
app.use('/api/profile', profileRoutes);
app.use('/api/itinerary', itineraryRouter);
app.use('/api/email-preferences', emailPreferencesRoute);
app.use('/api/travelSchedule', travelSchedulesRoutes);
app.use('/api/updateScheduleRoutes', updateScheduleRoutes);
app.use('/api', communityRoutes);
app.use('/api/itineraryTime', arriveItinerary);
app.use("/api/tripShares", tripSharesRoute);

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', message: 'Backend is alive' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
