import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const MyTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [cancellingToken, setCancellingToken] = useState(null);
  const location = useLocation();

  useEffect(() => {
    fetchTokens();
  }, []);

  // Refresh when new booking is made
  useEffect(() => {
    if (location.state?.refresh) {
      fetchTokens();
    }
  }, [location.state]);

  const fetchTokens = async () => {
    setLoading(true);
    try {
      // Try fetching from MongoDB
      const response = await fetch('http://localhost:5000/api/tokens');
      const data = await response.json();
      
      const formattedTokens = (data.tokens || []).map(token => ({
        id: token._id,
        temple: token.templeId?.name || 'Temple',
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
        status: token.status || 'active',
        expiry: new Date(token.expiresAt).toLocaleString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        qr: token.qrCode,
        price: token.price
      }));
      
      setTokens(formattedTokens);
      console.log('✅ Loaded tokens from MongoDB:', formattedTokens);
      
    } catch (error) {
      console.error('⚠️ MongoDB unavailable, checking localStorage:', error);
      
      // Fallback to localStorage
      const localTokens = JSON.parse(localStorage.getItem('localTokens') || '[]');
      
      if (localTokens.length > 0) {
        const formattedLocalTokens = localTokens.map(token => ({
          id: token._id,
          temple: token.templeId?.name || 'Temple',
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
          status: token.status || 'active',
          expiry: new Date(token.expiresAt).toLocaleString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }),
          qr: token.qrCode,
          price: token.price
        }));
        
        setTokens(formattedLocalTokens);
        console.log('💾 Loaded tokens from localStorage:', formattedLocalTokens);
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelToken = async (tokenId) => {
    setCancellingToken(tokenId);
    
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${tokenId}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (response.ok) {
        setTokens(tokens.map(token => 
          token.id === tokenId 
            ? { ...token, status: 'cancelled' }
            : token
        ));
        alert('✅ Token cancelled successfully!');
      } else {
        throw new Error('Failed to cancel');
      }
    } catch (error) {
      console.error('Cancel error:', error);
      
      // Fallback: Update localStorage
      const localTokens = JSON.parse(localStorage.getItem('localTokens') || '[]');
      const updatedTokens = localTokens.map(t => 
        t._id === tokenId ? { ...t, status: 'cancelled' } : t
      );
      localStorage.setItem('localTokens', JSON.stringify(updatedTokens));
      
      setTokens(tokens.map(token => 
        token.id === tokenId 
          ? { ...token, status: 'cancelled' }
          : token
      ));
      
      alert('⚠️ Backend unavailable. Token cancelled locally.');
    } finally {
      setCancellingToken(null);
    }
  };

  const filteredTokens = tokens.filter(token => 
    activeTab === 'all' || token.status === activeTab
  );

  const getStatusBadge = (status) => {
    const badges = {
      active: 'bg-green-100 text-green-800 border border-green-200',
      expired: 'bg-red-100 text-red-800 border border-red-200',
      used: 'bg-gray-100 text-gray-800 border border-gray-200',
      cancelled: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
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
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center min-h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-amber-500 mx-auto mb-6"></div>
              <p className="text-xl text-gray-700">Loading your tokens...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent mb-6">
            My Tokens
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Manage your active darshan tokens and QR codes for seamless temple entry
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-xl">
          {['all', 'active', 'expired', 'cancelled'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg ${
                activeTab === tab
                  ? 'bg-amber-500 text-white shadow-amber-500/25'
                  : 'bg-white/70 hover:bg-white shadow-md text-gray-700 hover:shadow-lg'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className="ml-2 bg-white/40 px-3 py-1 rounded-xl text-sm">
                {tab === 'all' ? tokens.length : tokens.filter(t => t.status === tab).length}
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
              className="inline-flex items-center px-10 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300"
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
                      <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold">🛕</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{token.temple}</h3>
                        <p className="text-4xl font-bold text-amber-600 mb-1">{token.token}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>📅 {token.date}</span>
                          <span>🕒 {token.time}</span>
                        </div>
                      </div>
                    </div>
                    
                    {token.status === 'active' && (
                      <button
                        onClick={() => cancelToken(token.id)}
                        disabled={cancellingToken === token.id}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ml-auto"
                      >
                        {cancellingToken === token.id ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Cancelling...</span>
                          </>
                        ) : (
                          <>
                            <span>❌ Cancel</span>
                          </>
                        )}
                      </button>
                    )}
                    
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
                <div className="p-8 bg-gradient-to-r from-gray-50 to-amber-50/30">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="text-center">
                      <div className="w-48 h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl mx-auto mb-4 p-6 flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all">
                        <div className="text-center">
                          <span className="text-4xl animate-pulse">📱</span>
                          <p className="text-xs font-mono mt-2 text-gray-700 bg-white/70 px-2 py-1 rounded">{token.qr}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Show QR at temple entry</p>
                      <button className="px-6 py-2 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 transition-all text-sm shadow-lg">
                        Download QR
                      </button>
                    </div>

                    <div className="space-y-3">
                      <Link
                        to="/virtual-queue"
                        className="block w-full text-center py-4 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                      >
                        Book Another Slot
                      </Link>
                      <Link
                        to="/history"
                        className="block w-full text-center py-3 px-6 border-2 border-amber-500 text-amber-600 font-semibold rounded-2xl hover:bg-amber-500 hover:text-white transition-all shadow-lg"
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
            <div className="text-3xl font-bold text-amber-600 mb-2">{tokens.filter(t => t.status === 'active').length}</div>
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
            <div className="text-3xl font-bold text-yellow-600 mb-2">{tokens.filter(t => t.status === 'cancelled').length}</div>
            <div className="text-gray-600 font-semibold">Cancelled</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTokens;