require('dotenv').config();

const express = require('express');
const cors = require('cors');
const YAML = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const passport = require('passport');
require('./src/middlewares/passport.js');

const app = express();

const swaggerDocument = YAML.load('./swagger.yaml');

const allowedOrigins = [
  process.env.VITE_API_URL,
  'http://localhost:5173',
  'https://maytripfoliodev.netlify.app',
  'https://portfolioo-devv.netlify.app',
  'https://tripfolioo.netlify.app',
  process.env.LINEPAY_RETURN_HOST,
  'https://baseline-distribute-bouquet-makeup.trycloudflare.com',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else if (
      origin.endsWith('.trycloudflare.com') ||
      (origin.startsWith('https://') && origin.includes('.trycloudflare.com'))
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());
app.use('/uploads', express.static('uploads'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const authRoutes = require('./src/routes/authRoutes');
const loginRouter = require('./src/routes/loginRoutes');
const oauthRouter = require('./src/routes/oAuthRoute');
const protectedRoutes = require('./src/routes/protectedRoutes');
const profileRoutes = require('./src/routes/profileRoutes');
const itineraryRouter = require('./src/routes/itinerary');
const travelSchedulesRoutes = require('./src/routes/scheduleRoutes');
const updateScheduleRoutes = require('./src/routes/updateScheduleRoutes');
const arriveItinerary = require('./src/routes/arriveItinerary');
const emailPreferencesRoute = require('./src/routes/emailPreferencesRoute');
const communityRoutes = require('./src/routes/communityRoutes');
const tripSharesRoute = require('./src/routes/tripSharesRoute');
const postsRoute = require('./src/routes/postsRoute');
const commentsRoutes = require('./src/routes/commentsRoutes');
const favoritesRoute = require('./src/routes/favoritesRoute');
const paymentRoute = require('./src/routes/paymentRoutes');
const linePayRoutes = require('./src/routes/linePayRoutes');
const trafficRoutes = require('./src/routes/trafficData');

app.use('/api/signup', authRoutes);
app.use('/api/login', loginRouter);
app.use('/auth', oauthRouter);
app.use('/api', protectedRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/itinerary', itineraryRouter);
app.use('/api/itineraryTime', arriveItinerary);
app.use('/api/travelSchedule', travelSchedulesRoutes);
app.use('/api/updateScheduleRoutes', updateScheduleRoutes);
app.use('/api/email-preferences', emailPreferencesRoute);
app.use('/api/community', communityRoutes);
app.use('/api/tripShares', tripSharesRoute);
app.use('/api/allposts', postsRoute);
app.use('/api/post', commentsRoutes);
app.use('/api/favorites', favoritesRoute);
app.use('/api/payment', paymentRoute);
app.use('/api/linepay', linePayRoutes);
app.use('/api/traffic', trafficRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is alive 🚀' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
