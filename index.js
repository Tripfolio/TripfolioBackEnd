const express = require('express');
const cors = require('cors');
const travelSchedulesRoutes = require('./src/routes/scheduleRoutes');
const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/travelSchedule', travelSchedulesRoutes);


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
