require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

const YAML = require('yamljs');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = YAML.load('./swagger.yaml');
const authRoutes = require('./src/routes/authRoutes');
const protectedRoutes = require('./src/routes/protectedRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const itineraryRouter = require('./src/routes/itinerary');
const emailPreferencesRoute = require('./src/routes/emailPreferencesRoute');
const travelSchedulesRoutes = require('./src/routes/scheduleRoutes');
const communityRoutes = require('./src/routes/communityRoutes');
const paymentRoute = require('./src/routes/paymentRoutes');
const linePayRoutes = require('./src/routes/linePayRoutes');
const updateScheduleRoutes = require('./src/routes/updateScheduleRoutes');
const tripSharesRoute = require('./src/routes/tripSharesRoute');
const loginRouter = require('./src/routes/loginRoutes');
const arriveItinerary = require('./src/routes/arriveItinerary');
const postsRoute = require('./src/routes/postsRoute');
const commentsRoutes = require('./src/routes/commentsRoutes');
const favoritesRoute = require('./src/routes/favoritesRoute');
const trafficRoutes = require('./src/routes/trafficData');

const allowedOrigins = [
  'http://localhost:5173',
  'https://portfolioo-devv.netlify.app',
  'https://tripfolioo.netlify.app',
  process.env.LINEPAY_RETURN_HOST,
  'https://baseline-distribute-bouquet-makeup.trycloudflare.com',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    if (
      origin.endsWith('.trycloudflare.com') ||
      (origin.startsWith('https://') && origin.includes('.trycloudflare.com'))
    ) {
      callback(null, true);
      return;
    }
    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/signup', authRoutes);
app.use('/api', protectedRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/login', loginRouter);
app.use('/uploads', express.static('uploads'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/itinerary', itineraryRouter);
app.use('/api/travelSchedule', travelSchedulesRoutes);
app.use('/api/updateScheduleRoutes', updateScheduleRoutes);
app.use('/api/itineraryTime', arriveItinerary);
app.use('/api/email-preferences', emailPreferencesRoute);
app.use('/api/community', communityRoutes);
app.use('/api/tripShares', tripSharesRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/allposts', postsRoute);
app.use('/api/post', commentsRoutes);
app.use('/api/favorites', favoritesRoute);
app.use('/api/linepay', linePayRoutes);
app.use('/api/traffic', trafficRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is alive' });

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
