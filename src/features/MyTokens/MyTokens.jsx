import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MyTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/tokens');
      const data = await response.json();
      
      const activeTokens = (data.tokens || [])
        .filter(token => token.status === 'active' || !token.status)
        .map(token => ({
          id: token._id,
          temple: token.templeId?.name || 'Somnath Temple',
          date: new Date(token.slotTime).toLocaleDateString('en-IN'),
          time: new Date(token.slotTime).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          }) + ' - ' + 
          new Date(new Date(token.slotTime).getTime() + 45*60000).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
          }),
          token: token.token,
          expiryTime: new Date(token.expiresAt).toLocaleString('en-IN'),
          qrCode: token.qrCode,
          devotees: token.devotees || 1,
          price: token.price || '₹0'
        }));
      
      setTokens(activeTokens);
    } catch (error) {
      console.error('Error fetching tokens:', error);
      // Mock active token for demo
      setTokens([
        {
          id: 1,
          temple: 'Somnath Temple',
          date: new Date().toLocaleDateString('en-IN'),
          time: '10:00 AM - 10:45 AM',
          token: 'TKN-260126-001',
          expiryTime: new Date(Date.now() + 24*60*60*1000).toLocaleString('en-IN'),
          qrCode: 'QR_TKN_260126_001',
          devotees: 1,
          price: '₹100'
        },
        {
          id: 2,
          temple: 'Dwarka Temple',
          date: new Date(Date.now() + 86400000).toLocaleDateString('en-IN'),
          time: '02:00 PM - 02:45 PM',
          token: 'TKN-270126-002',
          expiryTime: new Date(Date.now() + 48*60*60*1000).toLocaleString('en-IN'),
          qrCode: 'QR_TKN_270126_002',
          devotees: 2,
          price: '₹200'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-emerald-500 mx-auto mb-6"></div>
              <p className="text-xl text-gray-700">Loading your active tokens...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            🎫 Active Tokens
          </h1>
          <p className="text-lg text-gray-700">
            Your valid darshan passes ready to use
          </p>
        </div>

        {/* Active Tokens List */}
        {tokens.length === 0 ? (
          <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl">
            <div className="text-6xl mb-4">🎟️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Active Tokens</h3>
            <p className="text-gray-600 mb-6">Book a darshan slot to get your token</p>
            <Link
              to="/virtual-queue"
              className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg transition-all"
            >
              Book Darshan Now →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {tokens.map((token) => (
              <div key={token.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden">
                {/* Token Info */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 md:p-8">
                  <div className="grid md:grid-cols-3 gap-6 items-center">
                    {/* Token Details */}
                    <div>
                      <p className="text-sm opacity-90 mb-1">Temple</p>
                      <h3 className="text-2xl font-bold mb-3">{token.temple}</h3>
                      <p className="text-3xl font-bold tracking-wider mb-2">{token.token}</p>
                      <p className="text-xs opacity-80">Token ID</p>
                    </div>

                    {/* Date & Time */}
                    <div>
                      <p className="text-sm opacity-90 mb-1">Schedule</p>
                      <p className="text-xl font-semibold mb-1">📅 {token.date}</p>
                      <p className="text-lg font-bold mb-2">🕒 {token.time}</p>
                      <p className="text-xs opacity-80">Valid for 45 minutes</p>
                    </div>

                    {/* Devotees & Price */}
                    <div className="text-center">
                      <div className="bg-white/20 rounded-lg p-4">
                        <p className="text-sm opacity-90 mb-2">Passes</p>
                        <p className="text-3xl font-bold mb-3">{token.devotees}</p>
                        <p className="text-2xl font-bold">{token.price}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-200">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* QR Display */}
                    <div className="text-center">
                      <div className="bg-white border-4 border-emerald-200 rounded-2xl p-6 inline-block shadow-lg">
                        <div className="w-48 h-48 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <span className="text-5xl">📱</span>
                            <p className="text-xs font-mono text-gray-700 mt-2 bg-white px-2 py-1 rounded">{token.qrCode}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-3 font-semibold">Show at Temple Entry</p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                        📥 Download QR Code
                      </button>
                      <button className="w-full bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-bold py-3 px-6 rounded-xl transition-all">
                        📍 View Location
                      </button>
                      <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all">
                        ⏱️ Check Wait Time
                      </button>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-600 mb-1">Expires</p>
                        <p className="text-sm font-bold text-yellow-700">{token.expiryTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 bg-white/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-lg">
          <p className="text-center text-lg">
            <span className="font-bold text-emerald-600">{tokens.length}</span>
            <span className="text-gray-600 ml-2">active token{tokens.length !== 1 ? 's' : ''} ready to use</span>
          </p>
        </div>

        {/* Book More */}
        <div className="mt-8 text-center">
          <Link
            to="/virtual-queue"
            className="inline-block px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-lg rounded-2xl shadow-xl transition-all"
          >
            ➕ Book More Tokens
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyTokens;