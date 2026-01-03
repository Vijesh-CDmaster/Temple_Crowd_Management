import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();

  const publicNav = [
    { path: '/', label: 'Home' },
    { path: '/temples', label: 'Temples' },
    { path: '/maps', label: 'Maps' }
  ];

  const protectedNav = [
    { path: '/virtual-queue', label: 'Virtual Queue' },
    { path: '/my-tokens', label: 'My Tokens' },
    { path: '/history', label: 'History' }
  ];

  const isActive = (path) => location.pathname === path ? 'border-b-2 border-temple-gold text-temple-gold' : '';

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-temple-gold rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">🛕</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-temple-gold to-amber-600 bg-clip-text text-transparent">
              TempleConnect
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {publicNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-lg font-medium rounded-lg transition-all duration-200 hover:bg-temple-beige/50 ${isActive(item.path)}`}
              >
                {item.label}
              </Link>
            ))}
            
            {isAuthenticated && protectedNav.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 text-lg font-medium rounded-lg transition-all duration-200 hover:bg-temple-beige/50 ${isActive(item.path)}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side - Auth & Mobile menu */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700 hidden md:inline">
                  {user?.email?.split('@')[0] || 'Devotee'}
                </span>
                <button
                  onClick={logout}
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-all duration-200 text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-all duration-200 text-sm hidden md:inline"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-temple-gold hover:bg-opacity-90 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-temple-beige/50">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
