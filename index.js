const express = require('express');
const cors = require('cors');
const memberRoutes = require('./src/routes/memberRoutes');
const itineraryRouter = require('./src/routes/itinerary')
const emailPreferencesRoute = require('./src/routes/emailPreferencesRoute');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api', memberRoutes);
app.use('/api/itinerary', itineraryRouter);
app.use("/api/email-preferences", emailPreferencesRoute);


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
