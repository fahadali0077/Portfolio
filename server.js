const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();

app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
// serverSelectionTimeoutMS makes a connection problem (bad URI, Atlas IP
// allowlist missing this host, etc.) fail fast with a clear error instead
// of buffering queries until the client times out.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio', {
  serverSelectionTimeoutMS: 10000
})
  .then(() => console.log('✓ MongoDB connected successfully'))
  .catch(err => console.error('✗ MongoDB connection error:', err));

// API Routes
app.use('/api/contact', require('./routes/contact'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/skills', require('./routes/skills'));

// Health check — must be declared BEFORE the production catch-all below
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

// Keep-alive self-ping. Prevents free-tier hosts like Render from spinning
// the service down after inactivity. Render injects RENDER_EXTERNAL_URL
// automatically, so this works with zero config; SELF_PING_URL can override.
const KEEP_ALIVE_URL = process.env.SELF_PING_URL || process.env.RENDER_EXTERNAL_URL;
if (process.env.NODE_ENV === 'production' && KEEP_ALIVE_URL) {
  const https = require('https');
  // Render sleeps after ~15 min idle; ping every ~13 min to stay ahead of it.
  setInterval(() => {
    https.get(`${KEEP_ALIVE_URL}/api/health`, (res) => {
      console.log('Self-ping:', res.statusCode);
    }).on('error', (e) => console.error('Ping error:', e.message));
  }, 07 * 60 * 1000);
}

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
});
