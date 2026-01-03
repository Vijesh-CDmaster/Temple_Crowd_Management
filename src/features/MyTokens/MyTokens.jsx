import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MyTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    // Mock token data for demo
    setTimeout(() => {
      setTokens([
        {
          id: 1,
          temple: 'Somnath Temple',
          date: '2026-01-04',
          time: '10:30 AM - 11:15 AM',
          token: 'TKN-20260104-001',
          status: 'active',
          expiry: '2026-01-04 09:30 AM',
          qr: 'QR_CODE_001'
        },
        {
          id: 2,
          temple: 'Dwarka Temple',
          date: '2026-01-05',
          time: '2:00 PM - 2:45 PM',
          token: 'TKN-20260105-002',
          status: 'active',
          expiry: '2026-01-05 01:00 PM',
          qr: 'QR_CODE_002'
        },
        {
          id: 3,
          temple: 'Akshardham',
          date: '2026-01-03',
          time: '11:00 AM - 11:45 AM',
          token: 'TKN-20260103-003',
          status: 'expired',
          expiry: '2026-01-03 10:00 AM',
          qr: 'QR_CODE_003'
        }
      ]);
      setLoading(false);
    }, 1200);
  }, []);

  const filteredTokens = tokens.filter(token => 
    activeTab === 'all' || token.status === activeTab
  );

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800 border border-green-200',
      expired: 'bg-red-100 text-red-800 border border-red-200',
      used: 'bg-gray-100 text-gray-800 border border-gray-200'
    };
    return badges[status] || badges.expired;
  };

  const formatTime = (timeStr) => {
    return new Date(timeStr).toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-temple-beige to-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-temple-gold mx-auto mb-6"></div>
              <p className="text-xl text-temple-dark/70">Loading your tokens...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-beige to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-temple-gold to-amber-600 bg-clip-text text-transparent mb-6">
            My Tokens
          </h1>
          <p className="text-xl text-temple-dark/70 max-w-2xl mx-auto">
            Manage your active darshan tokens and QR codes for seamless temple entry
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
          {['all', 'active', 'expired', 'used'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg ${
                activeTab === tab
                  ? 'bg-temple-gold text-white shadow-temple-gold/25'
                  : 'bg-white/70 hover:bg-white shadow-md text-gray-700 hover:shadow-lg'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="ml-2 bg-white/40 px-3 py-1 rounded-xl text-sm">
                {tokens.filter(t => t.status === tab).length}
              </span>
            </button>
          ))}
        </div>

        {/* Tokens List */}
        {filteredTokens.length === 0 ? (
          <div className="text-center py-24 bg-white/70 backdrop-blur-sm rounded-3xl shadow-2xl">
            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mx-auto mb-8 flex items-center justify-center">
              <span className="text-4xl">🎫</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No tokens found</h3>
            <p className="text-gray-600 mb-10 text-lg">Book your first darshan token to get started</p>
            <Link
              to="/virtual-queue"
              className="inline-flex items-center px-10 py-4 bg-temple-gold hover:bg-opacity-90 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300"
            >
              Book Darshan Now
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredTokens.map((token) => (
              <div key={token.id} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300 group">
                <div className="p-8 border-b border-gray-100">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex items-start space-x-6 flex-1">
                      <div className="w-20 h-20 bg-gradient-to-br from-temple-gold to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold">🛕</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{token.temple}</h3>
                        <p className="text-4xl font-bold text-temple-gold mb-1">{token.token}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>📅 {token.date}</span>
                          <span>🕒 {token.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center">
                      <span className={`px-4 py-2 rounded-2xl text-sm font-bold ${getStatusBadge(token.status)}`}>
                        {token.status.toUpperCase()}
                      </span>
                      <div className="text-xs text-gray-500">
                        Expires: {formatTime(token.expiry)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code & Actions */}
                <div className="p-8 bg-gradient-to-r from-gray-50 to-temple-beige/30">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    {/* QR Code */}
                    <div className="text-center">
                      <div className="w-48 h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl mx-auto mb-4 p-6 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all">
                        <span className="text-4xl animate-pulse">📱</span>
                        <p className="text-xs font-mono mt-2 text-gray-500 bg-white/50 px-2 py-1 rounded">{token.qr}</p>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Show QR at temple entry</p>
                      <button className="px-6 py-2 bg-temple-gold text-white rounded-xl font-semibold hover:bg-opacity-90 transition-all text-sm shadow-lg">
                        Download QR
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <Link
                        to="/virtual-queue"
                        className="block w-full text-center py-4 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-opacity-90 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                      >
                        Book Another Slot
                      </Link>
                      <Link
                        to="/history"
                        className="block w-full text-center py-3 px-6 border-2 border-temple-gold text-temple-gold font-semibold rounded-2xl hover:bg-temple-gold hover:text-white transition-all shadow-lg"
                      >
                        View History →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mt-16">
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-temple-gold mb-2">{tokens.filter(t => t.status === 'active').length}</div>
            <div className="text-gray-600 font-semibold">Active Tokens</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-gray-600 mb-2">{tokens.length}</div>
            <div className="text-gray-600 font-semibold">Total Tokens</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{tokens.filter(t => t.status === 'expired').length}</div>
            <div className="text-gray-600 font-semibold">Expired</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{tokens.filter(t => t.status === 'used').length}</div>
            <div className="text-gray-600 font-semibold">Used</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTokens;
