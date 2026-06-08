require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const seed = require('./config/seed');

const app = express();

// ensure DB is connected before every request (critical for Vercel serverless)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Database connection failed', data: null });
  }
});

app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/logos', require('./routes/logos'));
app.use('/api/journey/events', require('./routes/journey/events'));
app.use('/api/journey/rides', require('./routes/journey/rides'));
app.use('/api/journey/inspires', require('./routes/journey/inspires'));
app.use('/api/journey/podcasts', require('./routes/journey/podcasts'));
app.use('/api/journey/timeline', require('./routes/journey/timeline'));

// run seed once after first connection in dev
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  connectDB().then(() => seed()).then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  });
} else {
  // seed on first cold start in production
  connectDB().then(() => seed()).catch(console.error);
}

module.exports = app;
