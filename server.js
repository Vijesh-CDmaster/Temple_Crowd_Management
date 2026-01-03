// server.js - TempleConnect Backend (COMPLETE)
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

// ✅ FIXED MongoDB Connection
mongoose.connect(config.uri)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas - templeconnect_db');
    console.log('📍 Database ready for TempleConnect!');
  })
  .catch(err => {
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  });

// ✅ FIXED: Load models AFTER connection
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

// 🔗 COMPLETE API ROUTES

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'TempleConnect Backend ✅ LIVE & READY!',
    timestamp: new Date().toISOString()
  });
});

// Seed Sample Data
app.get('/api/seed', async (req, res) => {
  try {
    if (!Temple) return res.status(503).json({ error: 'Database not ready' });
    await Temple.insertMany(config.sampleData.temples, { upsert: true });
    res.json({ 
      success: true, 
      message: '✅ Somnath + Dwarka temples seeded!',
      temples: config.sampleData.temples.length 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Temples
app.get('/api/temples', async (req, res) => {
  try {
    if (!Temple) return res.status(503).json({ error: 'Database not ready' });
    const temples = await Temple.find().lean();
    res.json({ success: true, temples, count: temples.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ FIXED: Book Darshan Token
app.post('/api/bookings', async (req, res) => {
  try {
    if (!Booking || !Temple) return res.status(503).json({ error: 'Database not ready' });
    
    const { templeId, slotTime, devotees = 1, price } = req.body;
    
    // Verify temple exists
    const temple = await Temple.findById(templeId);
    if (!temple) return res.status(404).json({ error: 'Temple not found' });
    
    // Generate token: TKN-YYMMDD-XXX
    const token = `TKN-${new Date().toISOString().slice(2,10).replace(/-/g,'')}-${Math.floor(Math.random()*999).toString().padStart(3,'0')}`;
    
    const demoUserId = new mongoose.Types.ObjectId();
    const booking = new Booking({
      token,
      userId: demoUserId,
      templeId: new mongoose.Types.ObjectId(templeId),
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
      booking: {
        id: booking._id,
        token: booking.token,
        temple: temple.name,
        slotTime: booking.slotTime,
        status: booking.status,
        qrCode: booking.qrCode,
        price: booking.price
      }
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ ALL TOKENS (Active + Expired + Cancelled)
app.get('/api/tokens', async (req, res) => {
  try {
    if (!Booking) return res.status(503).json({ error: 'Database not ready' });
    const bookings = await Booking.find()
      .populate('templeId', 'name city')
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json({ success: true, tokens: bookings, count: bookings.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ NEW: CANCEL TOKEN ENDPOINT
app.patch('/api/bookings/:id/cancel', async (req, res) => {
  try {
    if (!Booking) return res.status(503).json({ error: 'Database not ready' });
    
    const { id } = req.params;
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Token not found' });
    }
    
    if (booking.status !== 'active') {
      return res.status(400).json({ error: 'Only active tokens can be cancelled' });
    }
    
    booking.status = 'cancelled';
    await booking.save();
    
    res.json({ 
      success: true, 
      message: '✅ Token cancelled successfully!',
      booking: {
        id: booking._id,
        token: booking.token,
        status: booking.status
      }
    });
  } catch (error) {
    console.error('Cancel error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get Live Queue Status
app.get('/api/queue/:templeId', async (req, res) => {
  try {
    if (!Queue) return res.status(503).json({ error: 'Database not ready' });
    const queue = await Queue.findOne({ templeId: req.params.templeId })
      .sort({ lastUpdated: -1 })
      .lean();
    res.json({ success: true, queue: queue || { currentQueue: 0, estimatedWait: '0 mins' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`\n🚀 TempleConnect Backend LIVE: http://localhost:${PORT}`);
  console.log(`📱 React Frontend: http://localhost:3000`);
  console.log(`🔧 Test API: http://localhost:${PORT}/api/test`);
  console.log(`📊 Seed temples: http://localhost:${PORT}/api/seed`);
  console.log(`🎫 View tokens: http://localhost:${PORT}/api/tokens`);
});

