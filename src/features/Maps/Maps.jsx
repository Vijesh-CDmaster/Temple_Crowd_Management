import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Temple data with booking info
const temples = [
  { 
    id: 1, 
    name: 'Somnath Temple', 
    lat: 20.8884, 
    lng: 70.3889, 
    desc: 'First Jyotirlinga',
    bookedSlot: '14:30 PM',
    location: 'Veraval'
  },
  { 
    id: 2, 
    name: 'Dwarka Temple', 
    lat: 22.2478, 
    lng: 68.9991, 
    desc: 'Ancient Dwarkadhish',
    bookedSlot: '11:30 AM',
    location: 'Dwarka'
  },
  { 
    id: 3, 
    name: 'Akshardham', 
    lat: 23.0258, 
    lng: 72.5498, 
    desc: 'Divine architecture',
    bookedSlot: '15:00 PM',
    location: 'Gandhinagar'
  },
  { 
    id: 4, 
    name: 'Pavagarh', 
    lat: 22.4833, 
    lng: 73.5167, 
    desc: 'Hilltop Kalika Devi',
    bookedSlot: '12:00 PM',
    location: 'Pavagadh'
  },
  { 
    id: 5, 
    name: 'Ambaji Temple', 
    lat: 24.4333, 
    lng: 72.8500, 
    desc: 'Shakti Peeth',
    bookedSlot: '10:00 AM',
    location: 'Ambaji'
  }
];

const LocationMarker = ({ onLocationFound }) => {
  useMapEvents({
    locationfound(e) {
      onLocationFound(e.latlng);
    },
    click(e) {
      // Add temporary marker on click
    },
  });
  return null;
};

const Maps = () => {
  const [position, setPosition] = useState([23.0225, 72.5714]); // Gujarat center
  const [userLocation, setUserLocation] = useState(null);
  const [selectedTemple, setSelectedTemple] = useState(null);
  const [travelPlan, setTravelPlan] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookedTickets, setBookedTickets] = useState([]);

  // Check login & fetch booked tickets
  useEffect(() => {
    const token = localStorage.getItem('authToken') || localStorage.getItem('user');
    setIsLoggedIn(!!token);
    
    // Mock booked tickets (replace with real API)
    const tickets = JSON.parse(localStorage.getItem('bookedTickets') || '[]');
    setBookedTickets(tickets);
  }, []);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        setUserLocation([latitude, longitude]);
      },
      () => {},
      { enableHighAccuracy: true }
    );
  }, []);

  const filteredTemples = temples.filter(temple =>
    temple.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate distance between two points
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Generate travel plan for selected temple
  const generateTravelPlan = (temple) => {
    if (!userLocation) return;
    
    const distance = calculateDistance(
      userLocation[0], userLocation[1], 
      temple.lat, temple.lng
    );
    
    const plan = {
      temple: temple.name,
      darshanTime: temple.bookedSlot,
      distance: `${distance.toFixed(1)} km`,
      duration: distance < 100 ? '2-4 hrs' : distance < 300 ? '6-8 hrs' : '10+ hrs',
      arriveBy: '2 hours before darshan',
      options: [
        distance < 150 && {
          type: '🚗 Car/Taxi',
          duration: 'Fastest',
          cost: '₹2000-5000',
          details: 'Drive via NH47/NH51 - Book Ola/Uber'
        },
        distance < 500 && {
          type: '🚌 GSRTC Bus',
          duration: 'Budget Friendly',
          cost: '₹500-1500',
          details: `GSRTC Express from nearest bus station`
        },
        {
          type: '🚂 Train',
          duration: 'Most Comfortable',
          cost: '₹300-1200',
          details: getTrainDetails(temple.location)
        }
      ].filter(Boolean)
    };
    
    setSelectedTemple(temple);
    setTravelPlan(plan);
  };

  const getTrainDetails = (location) => {
    const trains = {
      'Veraval': 'Ahmedabad-Veraval SF Express (22958)',
      'Dwarka': 'Okha-Puri SF Express (20820)',
      'Gandhinagar': 'Ahmedabad MEMU (79401)',
      'Pavagadh': 'Godhra-Vadodara Passenger',
      'Ambaji': 'Palanpur Special (09424)'
    };
    return trains[location] || 'Check IRCTC for schedules';
  };

  // Login required screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-temple-beige to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-3xl p-12 text-center shadow-2xl">
          <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-pink-500 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl">
            <span className="text-4xl">🔒</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 to-temple-dark bg-clip-text text-transparent">
            Login Required
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Access personalized travel plans for your booked darshan tickets
          </p>
          <Link 
            to="/signin" 
            className="inline-flex px-12 py-4 bg-temple-gold hover:bg-opacity-90 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300"
          >
            Sign In →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-beige to-white">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-lg px-6 py-4 sticky top-0 z-20 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-temple-gold to-amber-600 bg-clip-text text-transparent">
            Temple Travel Planner
          </h1>
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search temples..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all shadow-sm"
            />
            <div className="absolute left-4 top-3.5 text-gray-400">🔍</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden h-[70vh] min-h-[500px]">
            <MapContainer
              center={position}
              zoom={8}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              
              {/* Temple Markers */}
              {temples.map((temple) => (
                <Marker
                  key={temple.id}
                  position={[temple.lat, temple.lng]}
                  eventHandlers={{
                    click: () => {
                      setSelectedTemple(temple);
                      generateTravelPlan(temple);
                    }
                  }}
                >
                  <Popup>
                    <div>
                      <div className="font-bold text-xl mb-3">{temple.name}</div>
                      <p className="text-sm text-gray-700 mb-4">{temple.desc}</p>
                      {bookedTickets.find(t => t.temple === temple.name) && (
                        <div className="bg-green-100 text-green-800 p-2 rounded-lg text-sm mb-4">
                          ✅ Booked: {temple.bookedSlot}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Link
                          to="/temples"
                          className="flex-1 bg-temple-gold text-white px-4 py-2 rounded-xl text-sm font-semibold text-center hover:bg-opacity-90"
                        >
                          Book Darshan
                        </Link>
                        <button
                          onClick={() => generateTravelPlan(temple)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700"
                        >
                          🗺️ Plan Route
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              
              {/* User Location */}
              {userLocation && (
                <Marker position={userLocation}>
                  <Popup>
                    <div className="text-center">
                      <div className="font-bold text-lg mb-2">🟢 Your Location</div>
                      <p className="text-sm text-gray-700">Current GPS position</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              <LocationMarker onLocationFound={setUserLocation} />
            </MapContainer>
          </div>

          {/* Travel Panel */}
          <div className="space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Booked Tickets */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="w-10 h-10 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mr-3 text-xl">🎫</span>
                Your Booked Darshan
              </h3>
              {bookedTickets.length > 0 ? (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {bookedTickets.map((ticket, idx) => (
                    <div key={idx} className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 cursor-pointer hover:shadow-lg transition-all" onClick={() => generateTravelPlan(temples.find(t => t.name === ticket.temple))}>
                      <div className="font-bold text-lg text-gray-900">{ticket.temple}</div>
                      <div className="text-emerald-600 font-semibold">{ticket.time}</div>
                      <div className="text-sm text-gray-600">{ticket.status}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <span className="text-5xl mb-4 block">🎫</span>
                  <p className="text-xl text-gray-600 mb-4">No booked tickets</p>
                  <Link to="/virtual-queue" className="px-8 py-3 bg-temple-gold text-white font-bold rounded-2xl shadow-lg hover:shadow-xl">
                    Book First →
                  </Link>
                </div>
              )}
            </div>

            {/* Travel Plan */}
            {travelPlan && (
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-3xl p-8 shadow-2xl">
                <h3 className="text-3xl font-bold mb-6 flex items-center">
                  <span className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center mr-4 text-2xl">🛣️</span>
                  Travel Plan: {travelPlan.temple}
                </h3>
                <div className="space-y-4 text-lg">
                  <div className="flex items-center bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                    <span className="w-12 h-12 bg-white/40 rounded-xl flex items-center justify-center mr-4">📏</span>
                    <span>{travelPlan.distance} ({travelPlan.duration})</span>
                  </div>
                  <div className="flex items-center bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                    <span className="w-12 h-12 bg-white/40 rounded-xl flex items-center justify-center mr-4">⏰</span>
                    <span>Darshan: {travelPlan.darshanTime} | Arrive: {travelPlan.arriveBy}</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-xl font-bold mb-4">Recommended Routes:</h4>
                  <div className="space-y-3">
                    {travelPlan.options.map((option, idx) => (
                      <div key={idx} className="bg-white/30 p-4 rounded-2xl backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xl font-bold">{option.type}</span>
                          <span className="font-semibold">{option.cost}</span>
                        </div>
                        <p className="text-sm opacity-95">{option.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            {!travelPlan && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center border border-gray-100">
                  <div className="text-3xl font-bold text-temple-gold">{temples.length}</div>
                  <div className="text-sm text-gray-600 mt-1">Total Temples</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center border border-gray-100">
                  <div className="text-3xl font-bold text-emerald-600">
                    {userLocation ? '🟢 Online' : '🔴 Locating...'}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">GPS Status</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maps;
