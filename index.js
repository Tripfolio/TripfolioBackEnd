require('dotenv').config()
const express = require('express')
const cors = require('cors')
const itineraryRouter = require('./src/routes/itinerary')

const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

app.use('/api/itinerary', itineraryRouter);

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
