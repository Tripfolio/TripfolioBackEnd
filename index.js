const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
dotenv.config(); 
const app = express();
const PORT = process.env.PORT;

const YAML = require("yamljs");
const swaggerUi = require("swagger-ui-express");

const swaggerDocument = YAML.load("./swagger.yaml"); // 確保路徑正確
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
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
app.use("/api/email-preferences", emailPreferencesRoute);
app.use('/api/travelSchedule', travelSchedulesRoutes);
app.use('/api', communityRoutes);
app.use("/api/itineraryTime", arriveItinerary);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
