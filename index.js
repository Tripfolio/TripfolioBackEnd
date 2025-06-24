const express = require('express');
const cors = require('cors');
const app = express();
const YAML = require("yamljs");
require("dotenv").config();

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = YAML.load("./swagger.yaml");
const authRoutes = require("./src/routes/authRoutes");
const protectedRoutes = require("./src/routes/protectedRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const itineraryRouter = require("./src/routes/itinerary");
const emailPreferencesRoute = require("./src/routes/emailPreferencesRoute");
const travelSchedulesRoutes = require("./src/routes/scheduleRoutes");
const trafficRoutes = require("./src/routes/trafficData");
const paymentRoute = require("./src/routes/paymentRoutes");
const updateScheduleRoutes = require("./src/routes/updateScheduleRoutes");
const communityRoutes = require('./src/routes/communityRoutes');
const loginRouter = require('./src/routes/loginRoutes');
const arriveItinerary = require('./src/routes/arriveItinerary');
const tripSharesRoute = require("./src/routes/tripSharesRoute");
const postsRoute = require("./src/routes/postsRoute");
const commentRoutes = require("./src/routes/commentsRoutes");
const favoritesRoutes = require("./src/routes/favoritesRoute");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://maytripfoliodev.netlify.app",
      "https://portfolioo-devv.netlify.app",
      "https://tripfolioo.netlify.app/",
    ],

    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);

app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', protectedRoutes);
app.use('/api/signup', authRoutes);
app.use('/api/login', loginRouter);
app.use("/api/profile", profileRoutes);
app.use('/api/itinerary', itineraryRouter);
app.use('/api/travelSchedule', travelSchedulesRoutes);
app.use("/api/traffic", trafficRoutes);
app.use('/api/updateScheduleRoutes', updateScheduleRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/itineraryTime', arriveItinerary);
app.use("/api/email-preferences", emailPreferencesRoute);
app.use("/api/tripShares", tripSharesRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/allposts", postsRoute);
app.use("/api/post", commentRoutes);
app.use("/api/favorites", favoritesRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Backend is alive 🚀" });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
