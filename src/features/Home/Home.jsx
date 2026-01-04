import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const temples = [
    { name: 'Somnath Temple', location: 'Veraval', image: '🛕' },
    { name: 'Dwarka Temple', location: 'Dwarka', image: '🛕' },
    { name: 'Akshardham', location: 'Gandhinagar', image: '🛕' },
    { name: 'Pavagarh Temple', location: 'Pavagarh', image: '🛕' },
    { name: 'Ambaji Temple', location: 'Ambaji', image: '🛕' },
    { name: 'Bhalka Temple', location: 'Bhalka', image: '🛕' }
  ];

  const features = [
    {
      title: 'Virtual Queue',
      description: 'Book darshan slots without waiting in long lines',
      icon: '🎫'
    },
    {
      title: 'Live Updates',
      description: 'Real-time queue status and temple timings',
      icon: '🕒'
    },
    {
      title: 'Temple Maps',
      description: 'Navigate to temples with accurate GPS locations',
      icon: '🗺️'
    },
    {
      title: 'Visit History',
      description: 'Track all your past darshan visits easily',
      icon: '📜'
    }
  ];

  // Check login status on mount
  useEffect(() => {
    const checkAuth = () => {
      // Check localStorage, sessionStorage, or cookies for auth token
      const token = localStorage.getItem('authToken') || 
                   sessionStorage.getItem('authToken') ||
                   document.cookie.split(';').find(row => row.includes('auth')) ||
                   localStorage.getItem('user');
      
      setIsLoggedIn(!!token);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-temple-beige to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-temple-gold mx-auto mb-4"></div>
          <p className="text-lg text-temple-dark">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-temple-beige to-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-temple-gold/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-temple-dark bg-clip-text text-transparent mb-6 leading-tight">
            Welcome to TempleConnect
          </h1>
          <p className="text-xl md:text-2xl text-temple-dark/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your guide to divine pilgrimage experience in Gujarat
          </p>
          <Link
            to="/temples"
            className="inline-flex items-center px-12 py-6 bg-temple-gold hover:bg-opacity-90 text-white text-xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 mx-auto"
          >
            Book Darshan
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-temple-gold to-amber-600 bg-clip-text text-transparent mb-6">
              Features for a Blessed Journey
            </h2>
            <p className="text-xl text-temple-dark/70 max-w-2xl mx-auto">
              We provide features to make your pilgrimage organized and fulfilling
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50">
                <div className="w-20 h-20 bg-gradient-to-br from-temple-gold to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-3xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <span>{feature.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-temple-gold transition-colors">{feature.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Temples */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-temple-beige/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-temple-gold to-amber-600 bg-clip-text text-transparent mb-6">
              Popular Gujarat Temples
            </h2>
            <p className="text-xl text-temple-dark/70">Discover sacred destinations across Gujarat</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {temples.map((temple, index) => (
              <Link
                key={index}
                to="/temples"
                className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white/50"
              >
                <div className="h-64 bg-gradient-to-br from-temple-gold/20 to-temple-beige p-8 flex flex-col justify-end">
                  <div className="w-24 h-24 bg-white/90 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <span className="text-4xl">{temple.image}</span>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-temple-gold transition-colors">{temple.name}</h3>
                  <p className="text-gray-600 mb-4">{temple.location}</p>
                  <button className="w-full bg-temple-gold hover:bg-opacity-90 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-200">
                    Book Darshan →
                  </button>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/temples"
              className="inline-flex items-center px-12 py-4 bg-temple-gold hover:bg-opacity-90 text-white font-bold text-lg rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              View All Temples
            </Link>
          </div>
        </div>
      </section>

      {/* ✅ CONDITIONAL CTA Section - HIDE FOR LOGGED IN USERS */}
      {!isLoggedIn && (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center bg-white/70 backdrop-blur-sm rounded-3xl p-12 shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-temple-dark bg-clip-text text-transparent mb-6">
              Ready for Divine Darshan?
            </h2>
            <p className="text-xl text-temple-dark/80 mb-8 max-w-2xl mx-auto">
              Join thousands of devotees booking seamless temple visits across Gujarat
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <Link
                to="/temples"
                className="flex-1 inline-flex items-center justify-center px-10 py-4 bg-temple-gold hover:bg-opacity-90 text-white font-bold text-lg rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300"
              >
                Book Now
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ✅ LOGGED IN USERS - Welcome Back Section */}
      {isLoggedIn && (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl p-12 shadow-2xl">
            <div className="w-24 h-24 bg-white/20 rounded-3xl mx-auto mb-8 flex items-center justify-center backdrop-blur-sm">
              <span className="text-4xl">🙏</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-2xl">
              Welcome Back Devotee!
            </h2>
            <p className="text-2xl opacity-95 mb-12 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
              Continue your divine journey with TempleConnect
            </p>
            <Link
              to="/my-tokens"
              className="inline-flex items-center px-12 py-5 bg-white hover:bg-opacity-90 text-gray-900 font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 backdrop-blur-sm"
            >
              View My Tokens →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
