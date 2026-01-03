// server.js - TempleConnect Backend (FULLY FIXED)
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const { config, models } = require('./db.config.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(express.json({ limit: '10mb' }));

// FIXED MongoDB Connection - NO DEPRECATED OPTIONS
mongoose.connect(config.uri)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas - templeconnect_db');
    console.log('📍 Database ready for TempleConnect!');
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    process.exit(1);
  });

// Load Models AFTER connection
let User, Temple, Booking, Slot, Queue;
mongoose.connection.on('connected', () => {
  const Models = models();
  User = Models.User;
  Temple = Models.Temple;
  Booking = Models.Booking;
  Slot = Models.Slot;
  Queue = Models.Queue;
  console.log('✅ Models loaded: User, Temple, Booking, Slot, Queue');
});

// 🔗 API ROUTES

// Seed Sample Data
app.get('/api/seed', async (req, res) => {
  try {
    await Temple.insertMany(config.sampleData.temples, { upsert: true });
    res.json({ 
      success: true, 
      message: '✅ Sample temples seeded! Somnath + Dwarka ready.',
      temples: config.sampleData.temples.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Temples
app.get('/api/temples', async (req, res) => {
  try {
    const temples = await Temple.find().lean();
    res.json({ 
      success: true, 
      temples,
      count: temples.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Book Darshan Token
app.post('/api/bookings', async (req, res) => {
  try {
    const { templeId, slotTime, devotees = 1, price } = req.body;
    
    // Generate Token: TKN-YYMMDD-XXX
    const token = `TKN-${new Date().toISOString().slice(2,10).replace(/-/g,'')}-${Math.floor(Math.random()*999).toString().padStart(3,'0')}`;
    
    const booking = new Booking({
      token,
      userId: new mongoose.Types.ObjectId(), // Demo user
      templeId,
      slotTime: new Date(slotTime),
      devotees,
      price,
      qrCode: `QR_${token}`,
      expiresAt: new Date(Date.now() + 24*60*60*1000) // 24hr expiry
    });

    await booking.save();
    res.json({ 
      success: true, 
      message: '✅ Darshan token booked successfully!',
      booking 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Tokens
app.get('/api/tokens', async (req, res) => {
  try {
    const bookings = await Booking.find({ status: 'active' })
      .populate('templeId', 'name city')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    res.json({ 
      success: true, 
      tokens: bookings,
      count: bookings.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Live Queue Status
app.get('/api/queue/:templeId', async (req, res) => {
  try {
    const queue = await Queue.findOne({ templeId: req.params.templeId })
      .sort({ lastUpdated: -1 })
      .lean();
    res.json({ success: true, queue: queue || {} });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'TempleConnect Backend API ✅ LIVE',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Backend LIVE: http://localhost:${PORT}`);
  console.log(`📱 Frontend: http://localhost:3000`);
  console.log(`🔗 Test API: http://localhost:${PORT}/api/test`);
  console.log(`📊 Seed data: http://localhost:${PORT}/api/seed`);
});
