import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-temple-dark to-gray-800 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-temple-gold rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">🛕</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-temple-gold to-amber-600 bg-clip-text text-transparent">
                  TempleConnect
                </h3>
                <p className="text-gray-300 mt-1">Your guide to divine pilgrimage experience in Gujarat</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="hover:text-temple-gold transition-colors">Home</Link></li>
              <li><Link to="/temples" className="hover:text-temple-gold transition-colors">Temples</Link></li>
              <li><Link to="/maps" className="hover:text-temple-gold transition-colors">Maps</Link></li>
              <li><Link to="/signin" className="hover:text-temple-gold transition-colors">Sign In</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <ul className="space-y-3 text-gray-300">
              <li>📧 support@templeconnect.in</li>
              <li>📱 +91 98765 43210</li>
              <li>📍 Gujarat, India</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2026 TempleConnect. All rights reserved. | Made with ❤️ for Gujarat devotees</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
