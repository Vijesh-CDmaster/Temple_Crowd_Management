import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProtectedRoute from '../../auth/ProtectedRoute';

const History = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // ✅ REAL MongoDB - NO Fake Data
  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tokens');
      const data = await response.json();
      
      // Convert MongoDB bookings to History format
      const formattedVisits = (data.tokens || []).map(booking => ({
        id: booking._id,
        temple: booking.templeId?.name || 'Temple',
        date: new Date(booking.slotTime).toLocaleDateString('en-IN'),
        time: new Date(booking.slotTime).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: true 
        }),
        token: `#${booking.token}`,
        status: booking.status === 'active' ? 'pending' : booking.status,
        duration: booking.status === 'cancelled' ? 'N/A' : '45 mins',
        price: booking.price
      }));
      
      setVisits(formattedVisits);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVisits = visits.filter(visit => 
    filter === 'all' || visit.status === filter
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-temple-beige to-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-temple-gold"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-beige to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-temple-gold to-amber-600 bg-clip-text text-transparent mb-4">
            Visit History
          </h1>
          <p className="text-xl text-temple-dark/70 max-w-2xl mx-auto">
            Track your divine darshan journeys across Gujarat's sacred temples
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-white/50 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          {['all', 'completed', 'cancelled', 'pending'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
                filter === status
                  ? 'bg-temple-gold text-white shadow-lg'
                  : 'bg-white/60 hover:bg-white shadow-md text-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== 'all' && (
                <span className="ml-2 text-sm bg-white/30 px-2 py-1 rounded-full">
                  {visits.filter(v => v.status === status).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* History Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden">
          {filteredVisits.length === 0 ? (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl">📜</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No visits yet</h3>
              <p className="text-gray-600 mb-8">Your pilgrimage history will appear here after booking darshan.</p>
              <Link
                to="/virtual-queue"
                className="inline-flex items-center px-8 py-4 bg-temple-gold hover:bg-opacity-90 text-white font-semibold rounded-2xl shadow-lg transition-all duration-200"
              >
                Book Your First Darshan
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-temple-gold/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Temple</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Token</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredVisits.map((visit) => (
                    <tr key={visit.id} className="hover:bg-temple-beige/20 transition-colors">
                      <td className="px-6 py-6">
                        <div className="font-semibold text-lg text-gray-900">{visit.temple}</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-sm font-medium text-gray-900">{visit.date}</div>
                        <div className="text-sm text-gray-600">{visit.time}</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="font-mono bg-gray-100 px-3 py-1 rounded-lg text-sm font-semibold">
                          {visit.token}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(visit.status)}`}>
                          {visit.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-900 font-medium">{visit.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-temple-gold mb-2">{visits.length}</div>
            <div className="text-gray-600 font-semibold">Total Visits</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {visits.filter(v => v.status === 'completed').length}
            </div>
            <div className="text-gray-600 font-semibold">Completed</div>
          </div>
          <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center">
            <div className="text-3xl font-bold text-gray-600 mb-2">
              {visits.filter(v => v.status === 'cancelled').length}
            </div>
            <div className="text-gray-600 font-semibold">Cancelled</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
