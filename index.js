const express = require('express');
const cors = require('cors');
const memberRoutes = require('./src/routes/memberRoutes');

const app = express();
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api', memberRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server runnung on port ${PORT}`);
});