// server.js - TempleConnect MongoDB Backend
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const { config, models } = require('./db.config.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to YOUR MongoDB Atlas
mongoose.connect(config.uri, config.options)
  .then(() => console.log('✅ Connected to MongoDB Atlas - templeconnect_db'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// Load Models
const { User, Temple, Booking, Slot, Queue } = models();

// SAMPLE DATA - Gujarat Temples
app.get('/api/seed', async (req, res) => {
  try {
    await Temple.insertMany(config.sampleData.temples);
    res.json({ success: true, message: 'Sample temples seeded!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Temples
app.get('/api/temples', async (req, res) => {
  const temples = await Temple.find().lean();
  res.json(temples);
});

// Book Darshan (TKN-xxx token)
app.post('/api/bookings', async (req, res) => {
  try {
    const { templeId, slotTime, devotees, price } = req.body;
    const token = `TKN-${new Date().toISOString().slice(2,10).replace(/-/g,'')}-${Math.floor(Math.random()*999).toString().padStart(3,'0')}`;
    
    const booking = new Booking({
      token,
      templeId,
      slotTime: new Date(slotTime),
      devotees,
      price,
      qrCode: `QR_${token}`,
      expiresAt: new Date(Date.now() + 24*60*60*1000) // 24hr expiry
    });

    await booking.save();
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get User Tokens
app.get('/api/tokens', async (req, res) => {
  const bookings = await Booking.find({ status: 'active' })
    .populate('templeId', 'name city')
    .sort({ createdAt: -1 })
    .lean();
  res.json(bookings);
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running: http://localhost:${PORT}`);
  console.log(`📱 Frontend: http://localhost:3000`);
});
