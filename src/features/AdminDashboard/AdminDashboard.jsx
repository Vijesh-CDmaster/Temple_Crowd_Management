import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [liveData, setLiveData] = useState({
    totalCrowd: 8742,
    entryRate: 145,
    exitRate: 98,
    sosRequests: 3,
    panicAlerts: 1,
    staffOnDuty: 87
  });

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        totalCrowd: Math.max(5000, Math.min(15000, prev.totalCrowd + Math.floor((Math.random() - 0.5) * 200))),
        entryRate: Math.max(50, Math.min(300, prev.entryRate + Math.floor((Math.random() - 0.5) * 30))),
        exitRate: Math.max(30, Math.min(250, prev.exitRate + Math.floor((Math.random() - 0.5) * 25))),
        sosRequests: Math.max(0, Math.min(10, prev.sosRequests + Math.floor((Math.random() - 0.7) * 2))),
        panicAlerts: Math.max(0, Math.min(5, prev.panicAlerts + Math.floor((Math.random() - 0.8) * 1))),
        staffOnDuty: Math.max(60, Math.min(120, prev.staffOnDuty + Math.floor((Math.random() - 0.5) * 5)))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/admin-signin');
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You must be logged in as an admin to access this page.</p>
          <button
            onClick={() => navigate('/admin-signin')}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-900 to-orange-800 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            {user.templeCity && (
              <p className="text-gray-600 text-sm">Temple: {user.templeCity}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-gray-800">{user.fullName}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 font-semibold border-b-2 transition-all ${
                activeTab === 'overview'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('surveillance')}
              className={`py-4 px-2 font-semibold border-b-2 transition-all ${
                activeTab === 'surveillance'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📹 Surveillance
            </button>
            <button
              onClick={() => setActiveTab('predictions')}
              className={`py-4 px-2 font-semibold border-b-2 transition-all ${
                activeTab === 'predictions'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🤖 AI Predictions
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`py-4 px-2 font-semibold border-b-2 transition-all ${
                activeTab === 'queue'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🎫 Queue Mgmt
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`py-4 px-2 font-semibold border-b-2 transition-all ${
                activeTab === 'staff'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              👥 Staff Mgmt
            </button>
            <button
              onClick={() => setActiveTab('emergency')}
              className={`py-4 px-2 font-semibold border-b-2 transition-all ${
                activeTab === 'emergency'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              🚨 Emergency
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-2 font-semibold border-b-2 transition-all ${
                activeTab === 'reports'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📈 Reports
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* CRITICAL ALERTS */}
            {(liveData.sosRequests > 0 || liveData.panicAlerts > 0) && (
              <div className="bg-gradient-to-r from-red-500 to-red-700 text-white rounded-2xl p-6 shadow-xl">
                <h3 className="text-2xl font-bold mb-4">🚨 CRITICAL ALERTS</h3>
                {liveData.sosRequests > 0 && (
                  <p className="text-lg mb-2">🆘 {liveData.sosRequests} Active SOS Requests - IMMEDIATE RESPONSE NEEDED</p>
                )}
                {liveData.panicAlerts > 0 && (
                  <p className="text-lg">⚠️ {liveData.panicAlerts} Panic Detection Alert(s) - Monitor Zone Activity</p>
                )}
              </div>
            )}

            {/* LIVE KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                <p className="text-gray-600 text-sm font-semibold">👥 Total Crowd</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{liveData.totalCrowd.toLocaleString()}</p>
                <p className="text-xs text-blue-600 mt-2">Capacity: 12,000</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
                <p className="text-gray-600 text-sm font-semibold">📥 Entry Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{liveData.entryRate}/min</p>
                <p className="text-xs text-green-600 mt-2">↑ Increasing</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
                <p className="text-gray-600 text-sm font-semibold">📤 Exit Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{liveData.exitRate}/min</p>
                <p className="text-xs text-orange-600 mt-2">Stable</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
                <p className="text-gray-600 text-sm font-semibold">🚨 SOS Requests</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{liveData.sosRequests}</p>
                <p className="text-xs text-red-600 mt-2">Active</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
                <p className="text-gray-600 text-sm font-semibold">😰 Panic Alerts</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{liveData.panicAlerts}</p>
                <p className="text-xs text-purple-600 mt-2">Detected</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-teal-500">
                <p className="text-gray-600 text-sm font-semibold">👨‍💼 Staff On Duty</p>
                <p className="text-3xl font-bold text-teal-600 mt-2">{liveData.staffOnDuty}</p>
                <p className="text-xs text-teal-600 mt-2">Available</p>
              </div>
            </div>

            {/* ZONE STATUS & HEATMAP */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">📍 Zone-wise Crowd Heatmap</h3>
                <div className="space-y-3">
                  {['Entry Gate', 'Main Hall', 'Queue Area', 'Exit Gate'].map((zone, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">{zone}</span>
                      <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            idx === 1 ? 'bg-red-500 w-4/5' :
                            idx === 2 ? 'bg-yellow-500 w-3/5' :
                            'bg-green-500 w-1/3'
                          }`}
                        ></div>
                      </div>
                      <span className="text-sm font-bold text-gray-900 w-12 text-right">{[80, 60, 50, 30][idx]}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">🏛️ Temple Status</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                    <p className="text-sm text-gray-600">Overall Status</p>
                    <p className="text-lg font-bold text-green-600">✅ OPEN & OPERATIONAL</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Open Time</p>
                      <p className="font-bold text-gray-900">6:00 AM</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600">Close Time</p>
                      <p className="font-bold text-gray-900">9:00 PM</p>
                    </div>
                  </div>
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold transition-all">
                    ⚙️ Manage Status
                  </button>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="grid md:grid-cols-3 gap-4">
              <button className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-2xl p-6 font-bold hover:shadow-lg transition-all">
                🎫 Pause Queue Booking
              </button>
              <button className="bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-2xl p-6 font-bold hover:shadow-lg transition-all">
                🚨 Trigger Emergency Protocol
              </button>
              <button className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-2xl p-6 font-bold hover:shadow-lg transition-all">
                📢 Send Broadcast Alert
              </button>
            </div>
          </div>
        )}

        {/* SURVEILLANCE TAB */}
        {activeTab === 'surveillance' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900">📹 Live Surveillance & IoT Monitoring</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((cam) => (
                <div key={cam} className="bg-gray-800 rounded-2xl overflow-hidden shadow-lg border-2 border-green-500">
                  <div className="aspect-video bg-gray-900 flex items-center justify-center relative">
                    <span className="text-4xl">📹</span>
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">🔴 LIVE</div>
                  </div>
                  <div className="bg-gray-700 p-4 text-white">
                    <p className="font-bold text-sm">Camera {cam}</p>
                    <p className="text-xs text-gray-400">Crowd Count: {Math.floor(Math.random() * 500)} persons</p>
                    <p className="text-xs text-green-400 mt-1">✅ Operational</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-bold text-gray-900 mb-4">Sensor Health Status</h4>
              <div className="grid md:grid-cols-3 gap-4">
                {['Temperature Sensors', 'Motion Detectors', 'Entry-Exit Counters'].map((sensor, idx) => (
                  <div key={idx} className="p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                    <p className="text-sm text-gray-600">{sensor}</p>
                    <p className="font-bold text-green-600">✅ All {8 - idx} sensors active</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AI PREDICTIONS TAB */}
        {activeTab === 'predictions' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900">🤖 AI Crowd Prediction & Analytics</h3>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-6">📊 Crowd Forecast (Next 6 Hours)</h4>
              <div className="h-64 bg-gradient-to-b from-blue-50 to-white rounded-xl p-6 flex items-end justify-around">
                {[2000, 3500, 5200, 7800, 9500, 8200].map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="bg-gradient-to-t from-blue-500 to-cyan-400 rounded-lg w-12" style={{height: `${(val / 10000) * 100}%`}}></div>
                    <p className="text-xs text-gray-600 mt-2">{idx * 1 + 1}h</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="font-bold text-gray-900 mb-4">⚠️ AI Confidence & Risk Level</h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Model Confidence</span>
                      <span className="text-sm font-bold text-green-600">94%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{width: '94%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-semibold text-gray-700">Risk Level</span>
                      <span className="text-sm font-bold text-red-600">MEDIUM (35%)</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500" style={{width: '35%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="font-bold text-gray-900 mb-4">🎪 Festival & Event Alerts</h4>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-gray-600">Upcoming Event</p>
                  <p className="font-bold text-gray-900">Makar Sankranti Festival</p>
                  <p className="text-xs text-gray-600 mt-1">Expected Footfall: 15,000+ | High Risk Alert</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QUEUE MANAGEMENT TAB */}
        {activeTab === 'queue' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900">🎫 Queue & Access Control Management</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-gray-600 text-sm font-semibold">Active Tokens Issued</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">1,245</p>
                <button className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold">
                  ⏸️ Pause Booking
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-gray-600 text-sm font-semibold">Priority Queue</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">89</p>
                <p className="text-xs text-gray-600 mt-2">Senior Citizens & Disabled</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-gray-600 text-sm font-semibold">Average Wait Time</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">32 min</p>
                <p className="text-xs text-green-600 mt-2">↓ Decreasing</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-bold text-gray-900 mb-6">Gate-wise Capacity Control</h4>
              <div className="space-y-4">
                {['Main Gate', 'Side Gate A', 'Side Gate B', 'VIP Gate'].map((gate, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-900">{gate}</span>
                      <span className="text-sm font-bold text-gray-900">{[87, 65, 72, 45][idx]}% Capacity</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${[87, 65, 72, 45][idx] > 80 ? 'bg-red-500' : 'bg-green-500'}`} 
                        style={{width: `${[87, 65, 72, 45][idx]}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STAFF MANAGEMENT TAB */}
        {activeTab === 'staff' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900">👥 Staff & Resource Management</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-blue-500">
                <p className="text-gray-600 text-sm font-semibold">Police Personnel</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">24</p>
                <p className="text-xs text-gray-600 mt-2">All Zones</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-green-500">
                <p className="text-gray-600 text-sm font-semibold">Volunteers</p>
                <p className="text-3xl font-bold text-green-600 mt-2">43</p>
                <p className="text-xs text-gray-600 mt-2">Crowd Control</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-red-500">
                <p className="text-gray-600 text-sm font-semibold">Medical Teams</p>
                <p className="text-3xl font-bold text-red-600 mt-2">12</p>
                <p className="text-xs text-gray-600 mt-2">Ambulances: 3</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border-t-4 border-purple-500">
                <p className="text-gray-600 text-sm font-semibold">Security Staff</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">8</p>
                <p className="text-xs text-gray-600 mt-2">Gate Guards</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-bold text-gray-900 mb-6">Zone Assignment & Availability</h4>
              <div className="grid md:grid-cols-2 gap-6">
                {['Zone 1: Entry', 'Zone 2: Main Hall', 'Zone 3: Queue', 'Zone 4: Exit'].map((zone, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-bold text-gray-900 mb-3">{zone}</p>
                    <div className="space-y-2 text-sm">
                      <p className="flex justify-between"><span className="text-gray-600">Staff Assigned:</span> <span className="font-bold">{[8, 12, 15, 6][idx]} persons</span></p>
                      <p className="flex justify-between"><span className="text-gray-600">Available:</span> <span className="font-bold text-green-600">{[5, 8, 10, 4][idx]} persons</span></p>
                      <button className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded font-semibold text-sm">
                        ➕ Reassign Staff
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EMERGENCY COMMAND CENTER TAB */}
        {activeTab === 'emergency' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900">🚨 Emergency Command Center</h3>
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-2xl p-8">
              <h4 className="text-2xl font-bold mb-4">ACTIVE SOS REQUESTS</h4>
              <div className="space-y-3">
                {[
                  { type: 'Medical Emergency', zone: 'Zone 2', time: '2 min ago' },
                  { type: 'Lost Person', zone: 'Zone 1', time: '5 min ago' },
                  { type: 'Crowd Crush Risk', zone: 'Main Gate', time: '8 min ago' }
                ].map((incident, idx) => (
                  <div key={idx} className="bg-red-700/50 p-3 rounded-lg flex justify-between items-center">
                    <div>
                      <p className="font-bold">{incident.type}</p>
                      <p className="text-sm text-red-100">{incident.zone} - {incident.time}</p>
                    </div>
                    <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded">
                      RESPOND
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="font-bold text-gray-900 mb-4">Panic Detection Timeline</h4>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-12 bg-red-500 rounded"></div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">High anxiety detected</p>
                      <p className="text-xs text-gray-600">Zone 2 - 3 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-12 bg-yellow-500 rounded"></div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Crowd surge warning</p>
                      <p className="text-xs text-gray-600">Main Gate - 7 minutes ago</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h4 className="font-bold text-gray-900 mb-4">Response Team Assignment</h4>
                <div className="space-y-3">
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-bold">
                    👨‍⚕️ Send Medical Team
                  </button>
                  <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg font-bold">
                    🚔 Call Police Unit
                  </button>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-bold">
                    📢 Emergency Announcement
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === 'reports' && (
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-gray-900">📈 Reports & Insights</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <button className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-blue-500 text-left">
                <p className="text-gray-600 text-sm font-semibold">📊 Daily Report</p>
                <p className="text-xl font-bold text-gray-900 mt-2">Generate Today</p>
              </button>
              <button className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-green-500 text-left">
                <p className="text-gray-600 text-sm font-semibold">📈 Weekly Analytics</p>
                <p className="text-xl font-bold text-gray-900 mt-2">View Statistics</p>
              </button>
              <button className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all border-l-4 border-purple-500 text-left">
                <p className="text-gray-600 text-sm font-semibold">🎪 Festival Reports</p>
                <p className="text-xl font-bold text-gray-900 mt-2">Historical Data</p>
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h4 className="text-xl font-bold text-gray-900 mb-6">AI Model Performance</h4>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="font-semibold text-gray-900 mb-4">Prediction Accuracy</p>
                  <div className="relative h-12 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-green-600" style={{width: '92%'}}></div>
                  </div>
                  <p className="text-center mt-2 font-bold text-gray-900">92% Accuracy Rate</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-4">Response Time Improvement</p>
                  <div className="relative h-12 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600" style={{width: '78%'}}></div>
                  </div>
                  <p className="text-center mt-2 font-bold text-gray-900">78% Faster Response</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
