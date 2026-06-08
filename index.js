require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const seed = require('./config/seed');

const app = express();
const PORT = process.env.PORT || 3000;

connectDB().then(() => seed());
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/logos', require('./routes/logos'));
app.use('/api/journey/events', require('./routes/journey/events'));
app.use('/api/journey/rides', require('./routes/journey/rides'));
app.use('/api/journey/inspires', require('./routes/journey/inspires'));
app.use('/api/journey/podcasts', require('./routes/journey/podcasts'));
app.use('/api/journey/timeline', require('./routes/journey/timeline'));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
