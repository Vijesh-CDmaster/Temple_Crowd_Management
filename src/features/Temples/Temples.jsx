import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Temples = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedTemple, setSelectedTemple] = useState(null);

  const temples = [
    {
      id: 1,
      name: 'Somnath Temple',
      city: 'Veraval',
      description: 'First of the 12 Jyotirlingas, sacred shrine of Lord Shiva',
      timings: '6AM - 9PM',
      distance: '320 km from Ahmedabad',
      image: '🛕',
      slots: [
        { time: '10:30 AM', status: 'available', price: '₹50' },
        { time: '2:00 PM', status: 'available', price: '₹100' },
        { time: '6:00 PM', status: 'full', price: '₹150' }
      ]
    },
    {
      id: 2,
      name: 'Dwarka Temple',
      city: 'Dwarka',
      description: 'Ancient temple of Lord Krishna, one of Char Dham',
      timings: '6AM - 8:30PM',
      distance: '430 km from Ahmedabad',
      image: '🛕',
      slots: [
        { time: '9:00 AM', status: 'available', price: '₹75' },
        { time: '12:30 PM', status: 'available', price: '₹125' },
        { time: '4:30 PM', status: 'available', price: '₹200' }
      ]
    },
    {
      id: 3,
      name: 'Akshardham Temple',
      city: 'Gandhinagar',
      description: 'Magnificent Swaminarayan temple with intricate carvings',
      timings: '10AM - 7PM (Closed Mon)',
      distance: '25 km from Ahmedabad',
      image: '🛕',
      slots: [
        { time: '11:00 AM', status: 'available', price: '₹30' },
        { time: '3:00 PM', status: 'full', price: '₹50' },
        { time: '5:30 PM', status: 'available', price: '₹75' }
      ]
    },
    {
      id: 4,
      name: 'Pavagarh Kalika Mata',
      city: 'Pavagarh',
      description: 'Hilltop temple dedicated to Goddess Kali',
      timings: '5AM - 8PM',
      distance: '180 km from Ahmedabad',
      image: '🛕',
      slots: [
        { time: '8:00 AM', status: 'available', price: '₹25' },
        { time: '1:00 PM', status: 'available', price: '₹50' },
        { time: '5:00 PM', status: 'available', price: '₹75' }
      ]
    },
    {
      id: 5,
      name: 'Ambaji Temple',
      city: 'Ambaji',
      description: 'One of 51 Shakti Peethas, heart-shaped Shree Yantra',
      timings: '6AM - 9PM',
      distance: '190 km from Ahmedabad',
      image: '🛕',
      slots: [
        { time: '9:30 AM', status: 'available', price: '₹40' },
        { time: '2:30 PM', status: 'available', price: '₹60' },
        { time: '7:00 PM', status: 'full', price: '₹100' }
      ]
    }
  ];

  const filteredTemples = temples.filter(temple => {
    const matchesSearch = temple.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         temple.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'all' || temple.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const cities = ['all', ...new Set(temples.map(t => t.city))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-beige to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-temple-gold to-amber-600 bg-clip-text text-transparent mb-6">
            Sacred Temples of Gujarat
          </h1>
          <p className="text-xl text-temple-dark/70 max-w-2xl mx-auto">
            Discover and book darshan slots at Gujarat's most revered temples
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search temples or cities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:ring-3 focus:ring-temple-gold/50 focus:border-transparent transition-all text-lg"
              />
              <div className="absolute left-5 top-5 text-xl text-gray-400">🔍</div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {cities.map(city => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-200 shadow-lg ${
                    selectedCity === city
                      ? 'bg-temple-gold text-white shadow-temple-gold/25'
                      : 'bg-white/60 hover:bg-white shadow-md text-gray-700'
                  }`}
                >
                  {city === 'all' ? 'All Cities' : city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Temples Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemples.map((temple) => (
            <div
              key={temple.id}
              className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-3 cursor-pointer"
              onClick={() => setSelectedTemple(temple)}
            >
              {/* Temple Image */}
              <div className="h-80 bg-gradient-to-br from-temple-gold/20 to-temple-beige/50 p-12 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-32 h-32 bg-white/90 rounded-3xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 z-10">
                  <span className="text-5xl">{temple.image}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
              </div>

              {/* Temple Details */}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-temple-gold transition-colors">
                  {temple.name}
                </h3>
                <div className="flex items-center text-lg mb-3">
                  <span className="text-temple-gold mr-2">📍</span>
                  <span>{temple.city}</span>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{temple.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div className="flex items-center">
                    <span className="text-temple-gold mr-2">🕒</span>
                    <span>{temple.timings}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-temple-gold mr-2">📏</span>
                    <span>{temple.distance}</span>
                  </div>
                </div>

                {/* Quick Slots */}
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-3">Available Slots</h4>
                  <div className="flex flex-wrap gap-2">
                    {temple.slots.map((slot, idx) => (
                      <Link
                        key={idx}
                        to="/virtual-queue"
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          slot.status === 'available'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                            : 'bg-gray-100 text-gray-500 line-through'
                        }`}
                      >
                        {slot.time} ({slot.price})
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  to="/virtual-queue"
                  className="w-full block text-center py-4 px-8 bg-gradient-to-r from-temple-gold to-amber-600 hover:from-opacity-90 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300"
                >
                  Book Darshan →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredTemples.length === 0 && (
          <div className="text-center py-24 col-span-full">
            <div className="w-32 h-32 bg-gray-100 rounded-3xl mx-auto mb-8 flex items-center justify-center">
              <span className="text-4xl">🛕</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No temples found</h3>
            <p className="text-gray-600 mb-8 text-lg">Try adjusting your search or city filter</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('all');
              }}
              className="px-10 py-4 bg-temple-gold hover:bg-opacity-90 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mt-20 mb-12">
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-temple-gold mb-2">{temples.length}</div>
            <div className="text-gray-600 font-semibold">Total Temples</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {temples.filter(t => t.slots.some(s => s.status === 'available')).length}
            </div>
            <div className="text-gray-600 font-semibold">Slots Available</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{filteredTemples.length}</div>
            <div className="text-gray-600 font-semibold">Showing Results</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Temples;
