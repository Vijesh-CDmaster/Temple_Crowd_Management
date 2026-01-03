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

const temples = [
  { id: 1, name: 'Somnath Temple', lat: 20.8884, lng: 70.3889, desc: 'First Jyotirlinga' },
  { id: 2, name: 'Dwarka Temple', lat: 22.2478, lng: 68.9991, desc: 'Ancient Dwarkadhish' },
  { id: 3, name: 'Akshardham', lat: 23.0258, lng: 72.5498, desc: 'Divine architecture' },
  { id: 4, name: 'Pavagarh', lat: 22.4833, lng: 73.5167, desc: 'Hilltop Kalika Devi' },
  { id: 5, name: 'Ambaji Temple', lat: 24.4333, lng: 72.8500, desc: 'Shakti Peeth' }
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
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-beige to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg px-6 py-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-4 items-center lg:items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-temple-gold to-amber-600 bg-clip-text text-transparent">
            Temple Maps
          </h1>
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search temples..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all"
            />
            <div className="absolute left-4 top-3.5 text-gray-400">🔍</div>
          </div>
          <Link
            to="/temples"
            className="px-8 py-3 bg-temple-gold hover:bg-opacity-90 text-white font-semibold rounded-2xl shadow-lg transition-all duration-200"
          >
            Book Darshan
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden h-[600px]">
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
              
              {temples.map((temple) => (
                <Marker
                  key={temple.id}
                  position={[temple.lat, temple.lng]}
                  eventHandlers={{
                    click: () => setSelectedTemple(temple)
                  }}
                >
                  <Popup>
                    <div className="font-bold text-lg mb-2">{temple.name}</div>
                    <p className="text-sm text-gray-700 mb-3">{temple.desc}</p>
                    <Link
                      to="/temples"
                      className="inline-block bg-temple-gold text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-opacity-90"
                    >
                      Book Darshan
                    </Link>
                  </Popup>
                </Marker>
              ))}
              
              {userLocation && (
                <Marker position={userLocation}>
                  <Popup>Your Location</Popup>
                </Marker>
              )}

              <LocationMarker onLocationFound={setUserLocation} />
            </MapContainer>
          </div>

          {/* Temple List */}
          <div className="space-y-6">
            {/* Legend */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Your Location</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Temple Locations</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center">
                <div className="text-2xl font-bold text-temple-gold">{temples.length}</div>
                <div className="text-sm text-gray-600">Total Temples</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-xl text-center">
                <div className="text-2xl font-bold text-green-600">
                  {userLocation ? 'Online' : 'Locating...'}
                </div>
                <div className="text-sm text-gray-600">GPS Status</div>
              </div>
            </div>

            {/* Temple List */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl p-6 max-h-96 overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Nearby Temples</h3>
              <div className="space-y-3">
                {filteredTemples.map((temple) => (
                  <div
                    key={temple.id}
                    className="flex items-center p-4 bg-white/50 rounded-xl hover:bg-white hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => setPosition([temple.lat, temple.lng])}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-temple-gold to-amber-500 rounded-xl flex items-center justify-center mr-4 shadow-lg">
                      <span className="text-xl font-bold">🛕</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-lg group-hover:text-temple-gold">{temple.name}</h4>
                      <p className="text-sm text-gray-600">{temple.desc}</p>
                    </div>
                    <Link
                      to="/temples"
                      className="ml-4 px-4 py-2 bg-temple-gold text-white rounded-xl text-sm font-semibold hover:bg-opacity-90 transition-all"
                    >
                      Book
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Distance Calculator CTA */}
        {userLocation && (
          <div className="mt-12 text-center">
            <Link
              to="/temples"
              className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-temple-gold to-amber-600 hover:from-opacity-90 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              Find Nearest Temple →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Maps;
