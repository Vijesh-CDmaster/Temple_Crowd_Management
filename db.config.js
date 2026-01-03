// db.config.js - TempleConnect MongoDB Atlas Configuration
const mongoose = require('mongoose');

// TempleConnect Database Schemas
const schemas = {
  User: new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    tokens: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
    createdAt: { type: Date, default: Date.now },
    lastLogin: Date
  }),

  Temple: new mongoose.Schema({
    name: { type: String, required: true },
    city: String,
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: [Number] // [lng, lat]
    },
    timings: String,
    price: { general: Number, vip: Number },
    slotsPerDay: Number,
    description: String
  }),

  Booking: new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
    slotTime: { type: Date, required: true },
    devotees: { type: Number, default: 1 },
    status: { 
      type: String, 
      enum: ['active', 'used', 'expired', 'cancelled'], 
      default: 'active' 
    },
    qrCode: String,
    price: Number,
    createdAt: { type: Date, default: Date.now },
    expiresAt: Date
  }),

  Slot: new mongoose.Schema({
    templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
    date: Date,
    time: String,
    totalSlots: Number,
    bookedSlots: { type: Number, default: 0 },
    availableSlots: Number,
    price: Number,
    status: { type: String, enum: ['open', 'full', 'closed'], default: 'open' }
  }),

  Queue: new mongoose.Schema({
    templeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Temple', required: true },
    currentQueue: Number,
    estimatedWait: String,
    darshanStatus: { type: String, enum: ['normal', 'peak', 'holiday'], default: 'normal' },
    lastUpdated: { type: Date, default: Date.now }
  })
};

// YOUR MongoDB Atlas Connection - UPDATED
const config = {
  uri: process.env.MONGODB_URI || "mongodb+srv://viju7122006-db:viju7122006@cluster0.bkdjtah.mongodb.net/templeconnect_db?retryWrites=true&w=majority",
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    authSource: 'admin'
  },
  dbName: 'templeconnect_db',
  sampleData: {
    temples: [
      {
        name: 'Somnath Temple',
        city: 'Veraval',
        location: { coordinates: [70.3889, 20.8884] },
        timings: '6AM-9PM',
        price: { general: 50, vip: 150 },
        slotsPerDay: 200
      },
      {
        name: 'Dwarka Temple',
        city: 'Dwarka',
        location: { coordinates: [68.9991, 22.2478] },
        timings: '6AM-8:30PM',
        price: { general: 75, vip: 200 },
        slotsPerDay: 150
      }
    ]
  }
};

// Generate Models
const models = () => {
  const modelObj = {};
  Object.keys(schemas).forEach(name => {
    modelObj[name] = mongoose.model(name, schemas[name]);
  });
  return modelObj;
};

module.exports = {
  schemas,
  config,
  models
};
