import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const WorkerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [shiftStatus, setShiftStatus] = useState('active');
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Monitor Entry Gate A', status: 'active', priority: 'high', assignedAt: '06:30 AM', dueAt: '02:00 PM' },
    { id: 2, title: 'Crowd Flow Management - Main Hall', status: 'active', priority: 'high', assignedAt: '07:15 AM', dueAt: '12:00 PM' },
    { id: 3, title: 'Welfare Check - Queue Section 3', status: 'pending', priority: 'medium', assignedAt: '08:00 AM', dueAt: '10:00 AM' },
    { id: 4, title: 'Emergency Evacuation Drill', status: 'completed', priority: 'medium', assignedAt: '05:00 AM', dueAt: '06:00 AM' }
  ]);
  const [liveData, setLiveData] = useState({
    currentCrowd: 4250,
    entryRate: 85,
    exitRate: 45,
    tasksCompleted: 12,
    activeAlerts: 2,
    sosRequests: 1
  });
  const [incidents, setIncidents] = useState([
    { id: 1, type: 'Crowd Surge', zone: 'Main Hall', severity: 'high', time: '2 min ago', status: 'active' },
    { id: 2, type: 'Lost Person Report', zone: 'Entry Gate', severity: 'medium', time: '5 min ago', status: 'active' }
  ]);
  const [lostPersons, setLostPersons] = useState([
    { id: 1, name: 'Unknown Male', age: '40-45', clothing: 'White Dhoti', lastSeen: 'Main Hall - 8:30 AM', status: 'active' },
    { id: 2, name: 'Child Female', age: '5-7', clothing: 'Pink Dress', lastSeen: 'Entry Gate - 9:15 AM', status: 'active' }
  ]);
  const [broadcasts, setBroadcasts] = useState([
    { id: 1, from: 'Admin Control Room', message: '⚠️ Gate B closed - redirect crowd to Gate A and C', time: '8 min ago', priority: 'high' },
    { id: 2, from: 'Medical Team', message: '🏥 First aid station moved to Section 5', time: '12 min ago', priority: 'normal' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        currentCrowd: Math.max(3000, Math.min(6000, prev.currentCrowd + Math.floor((Math.random() - 0.5) * 100))),
        entryRate: Math.max(30, Math.min(150, prev.entryRate + Math.floor((Math.random() - 0.5) * 20))),
        exitRate: Math.max(20, Math.min(100, prev.exitRate + Math.floor((Math.random() - 0.5) * 15))),
        tasksCompleted: prev.tasksCompleted,
        activeAlerts: Math.max(0, Math.min(5, prev.activeAlerts + Math.floor((Math.random() - 0.8) * 1))),
        sosRequests: Math.max(0, Math.min(3, prev.sosRequests + Math.floor((Math.random() - 0.9) * 1)))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/worker-signin');
  };

  const completeTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: 'completed' } : task
    ));
    setLiveData(prev => ({ ...prev, tasksCompleted: prev.tasksCompleted + 1 }));
  };

  const acceptTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: 'active' } : task
    ));
  };

  if (!user || user.role !== 'worker') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-purple-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Worker login required.</p>
          <button
            onClick={() => navigate('/worker-signin')}
            className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            Go to Worker Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 pb-24">
      {/* MOBILE HEADER */}
      <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold">👷</div>
              <div>
                <p className="font-bold text-sm">{user.fullName}</p>
                <p className="text-xs text-white/80">{user.department}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm"
            >
              Sign Out
            </button>
          </div>
          
          {/* Shift Status Bar */}
          <div className="bg-white/10 rounded-lg px-3 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Shift: {shiftStatus.toUpperCase()}</span>
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded">Zone 1 - Gate A</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="px-4 py-6 space-y-6">
        {/* ====== DASHBOARD TAB ====== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* CRITICAL ALERTS BANNER */}
            {liveData.activeAlerts > 0 && (
              <div className="bg-gradient-to-r from-red-500 to-red-700 text-white rounded-2xl p-5 shadow-lg animate-pulse">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🚨</span>
                  <div>
                    <p className="font-bold text-lg">{liveData.activeAlerts} ACTIVE ALERT(S)</p>
                    <p className="text-sm text-red-100">Tap ALERTS tab for details</p>
                  </div>
                </div>
              </div>
            )}

            {/* SOS QUICK RESPONSE */}
            {liveData.sosRequests > 0 && (
              <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🆘</span>
                    <div>
                      <p className="font-bold">{liveData.sosRequests} SOS REQUEST(S)</p>
                      <p className="text-sm text-orange-100">Pilgrim needs help</p>
                    </div>
                  </div>
                  <button className="bg-white text-red-600 font-bold px-4 py-2 rounded-lg text-sm hover:bg-red-50 transition-all">
                    → RESPOND
                  </button>
                </div>
              </div>
            )}

            {/* LIVE KPI CARDS */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
                <p className="text-gray-600 text-xs font-semibold uppercase">Current Crowd</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{liveData.currentCrowd}</p>
                <p className="text-xs text-blue-600 mt-1">↑ Increasing</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
                <p className="text-gray-600 text-xs font-semibold uppercase">Entry/Exit</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{liveData.entryRate}/{liveData.exitRate}</p>
                <p className="text-xs text-green-600 mt-1">Per minute</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
                <p className="text-gray-600 text-xs font-semibold uppercase">Tasks Today</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{liveData.tasksCompleted}</p>
                <p className="text-xs text-purple-600 mt-1">Completed</p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
                <p className="text-gray-600 text-xs font-semibold uppercase">Alerts</p>
                <p className="text-2xl font-bold text-red-600 mt-2">{liveData.activeAlerts}</p>
                <p className="text-xs text-red-600 mt-1">Active</p>
              </div>
            </div>

            {/* ZONE STATUS CARD */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <h3 className="font-bold text-gray-900 mb-4">📍 Your Assigned Zone</h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border-l-4 border-purple-500">
                  <p className="text-sm text-gray-600">Zone 1 - Main Entry Gate A</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">Status: ACTIVE ✅</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Crowd Density</span>
                    <span className="font-bold text-gray-900">72%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{width: '72%'}}></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg font-semibold text-sm transition-all">
                    📍 Navigate
                  </button>
                  <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg font-semibold text-sm transition-all">
                    ✓ Check In
                  </button>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">⚡ Quick Actions</h3>
              <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md">
                🗺️ View Zone Heatmap
              </button>
              <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-md">
                👥 Report Crowd Issue
              </button>
            </div>
          </div>
        )}

        {/* ====== TASK MANAGEMENT TAB ====== */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">✅ Task & Duty Management</h2>
            
            {/* SHIFT SCHEDULE */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="font-bold text-gray-900 mb-3">📅 Today's Shift Schedule</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Shift Start:</span>
                  <span className="font-bold text-gray-900">06:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shift End:</span>
                  <span className="font-bold text-gray-900">02:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Break Time:</span>
                  <span className="font-bold text-gray-900">12:00 PM - 12:30 PM</span>
                </div>
              </div>
            </div>

            {/* TASKS LIST */}
            <div className="space-y-3">
              {tasks.map(task => (
                <div key={task.id} className="bg-white rounded-xl shadow-md p-4 border-l-4 border-purple-500">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{task.title}</h4>
                      <p className="text-xs text-gray-600 mt-1">Assigned: {task.assignedAt} | Due: {task.dueAt}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${
                      task.priority === 'high' ? 'bg-red-100 text-red-700' : 
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    {task.status === 'pending' && (
                      <button
                        onClick={() => acceptTask(task.id)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg font-semibold text-sm transition-all"
                      >
                        Accept Task
                      </button>
                    )}
                    {task.status === 'active' && (
                      <>
                        <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-3 rounded-lg font-semibold text-sm transition-all">
                          Start
                        </button>
                        <button
                          onClick={() => completeTask(task.id)}
                          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg font-semibold text-sm transition-all"
                        >
                          Complete
                        </button>
                      </>
                    )}
                    {task.status === 'completed' && (
                      <span className="w-full bg-green-100 text-green-700 text-center py-2 px-3 rounded-lg font-semibold text-sm">
                        ✓ Completed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ====== CROWD MONITORING TAB ====== */}
        {activeTab === 'crowd' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">📊 Live Crowd Monitoring</h2>

            {/* ZONE STATUS GRID */}
            {['Entry Gate A', 'Main Hall', 'Queue Area', 'Exit Gate'].map((zone, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900">{zone}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                    [72, 88, 65, 45][idx] > 80 ? 'bg-red-100 text-red-700' :
                    [72, 88, 65, 45][idx] > 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {[72, 88, 65, 45][idx]}%
                  </span>
                </div>
                
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full ${
                      [72, 88, 65, 45][idx] > 80 ? 'bg-red-500' :
                      [72, 88, 65, 45][idx] > 60 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} 
                    style={{width: `${[72, 88, 65, 45][idx]}%`}}
                  ></div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <p className="text-gray-600">Entry</p>
                    <p className="font-bold text-gray-900">{[85, 45, 60, 35][idx]}/min</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Current</p>
                    <p className="font-bold text-gray-900">{[1200, 2100, 900, 500][idx]}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600">Exit</p>
                    <p className="font-bold text-gray-900">{[65, 40, 45, 32][idx]}/min</p>
                  </div>
                </div>

                {[72, 88, 65, 45][idx] > 80 && (
                  <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-2 text-xs text-red-700 font-semibold">
                    ⚠️ High Density - Manage entry flow
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ====== NAVIGATION TAB ====== */}
        {activeTab === 'navigation' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">🗺️ Navigation & Routes</h2>

            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-4 rounded-xl shadow-md hover:shadow-lg transition-all">
              📍 Navigate to Incident
            </button>

            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-4 rounded-xl shadow-md hover:shadow-lg transition-all">
              🏥 Nearest Medical Station
            </button>

            <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-4 px-4 rounded-xl shadow-md hover:shadow-lg transition-all">
              🚪 Emergency Exit Route
            </button>

            {/* OFFLINE ROUTES */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-bold text-gray-900 mb-3">📲 Offline Routes Available</h3>
              <p className="text-sm text-gray-600 mb-3">🟢 Temple layout cached for offline use</p>
              <div className="space-y-2">
                {['Exit Route A', 'Exit Route B', 'Emergency Assembly Point', 'First Aid Location'].map((route, idx) => (
                  <button key={idx} className="w-full text-left bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-all font-semibold text-sm">
                    {route}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ====== EMERGENCY & SOS TAB ====== */}
        {activeTab === 'emergency' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">🚨 Emergency & SOS Handling</h2>

            {/* ACTIVE INCIDENTS */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-bold text-gray-900 mb-3">🔴 Active Incidents</h3>
              <div className="space-y-3">
                {incidents.map(incident => (
                  <div key={incident.id} className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-900">{incident.type}</p>
                        <p className="text-sm text-gray-600">{incident.zone} • {incident.time}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded font-bold ${
                        incident.severity === 'high' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {incident.severity.toUpperCase()}
                      </span>
                    </div>
                    <button className="w-full mt-3 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg text-sm transition-all">
                      → Respond to Incident
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* EMERGENCY CONTACTS */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-bold text-gray-900 mb-3">📞 One-Tap Emergency Contacts</h3>
              <div className="space-y-2">
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-between">
                  <span>Control Room</span>
                  <span>📞</span>
                </button>
                <button className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-between">
                  <span>Medical Team</span>
                  <span>🏥</span>
                </button>
                <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg transition-all flex items-center justify-between">
                  <span>Police Backup</span>
                  <span>🚔</span>
                </button>
              </div>
            </div>

            {/* INCIDENT WORKFLOW */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-bold text-gray-900 mb-3">⚡ Incident Workflow</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-xs">1</div>
                  <span className="text-gray-700">Acknowledge Incident</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-xs">2</div>
                  <span className="text-gray-700">Navigate to Location</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center font-bold text-xs">3</div>
                  <span className="text-gray-700">Assess & Update Status</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-xs">4</div>
                  <span className="text-gray-700">Close Incident</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ====== LOST & FOUND TAB ====== */}
        {activeTab === 'lostfound' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">👤 Lost & Found Management</h2>

            {/* ACTIVE MISSING PERSONS */}
            <div className="space-y-3">
              {lostPersons.map(person => (
                <div key={person.id} className="bg-white rounded-xl shadow-md p-4 border-l-4 border-orange-500">
                  <div className="flex gap-3 mb-3">
                    <div className="w-16 h-16 bg-gray-300 rounded-lg flex items-center justify-center text-2xl">👤</div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{person.name}</p>
                      <p className="text-xs text-gray-600">Age: {person.age}</p>
                      <p className="text-xs text-gray-600">Clothing: {person.clothing}</p>
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 text-xs mb-2">
                    📍 Last Seen: {person.lastSeen}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg font-semibold text-xs transition-all">
                      ✓ Found
                    </button>
                    <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg font-semibold text-xs transition-all">
                      📍 Update Location
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* REPORT FOUND ITEM */}
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-4 rounded-xl shadow-md hover:shadow-lg transition-all">
              ➕ Report Found Item/Person
            </button>
          </div>
        )}

        {/* ====== COMMUNICATION & ALERTS TAB ====== */}
        {activeTab === 'communication' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">📢 Communication & Alerts</h2>

            {/* BROADCASTS */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 text-sm">📡 Admin Broadcasts</h3>
              {broadcasts.map(broadcast => (
                <div key={broadcast.id} className={`rounded-xl shadow-md p-4 border-l-4 ${
                  broadcast.priority === 'high' ? 'bg-red-50 border-red-500' : 'bg-white border-blue-500'
                }`}>
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-bold text-gray-900 text-sm">{broadcast.from}</p>
                    <span className="text-xs text-gray-600">{broadcast.time}</span>
                  </div>
                  <p className="text-sm text-gray-700">{broadcast.message}</p>
                  {broadcast.priority === 'high' && (
                    <button className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-3 rounded-lg font-semibold text-xs transition-all">
                      ✓ Acknowledge Alert
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* NOTIFICATION SETTINGS */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-bold text-gray-900 mb-3">🔔 Notification Settings</h3>
              <div className="space-y-3">
                {['Emergency Alerts', 'Task Assignments', 'Zone Updates', 'SOS Requests'].map((setting, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{setting}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* LANGUAGE SELECTION */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-bold text-gray-900 mb-3">🌐 Language</h3>
              <select className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:border-purple-500 focus:ring-2 focus:ring-purple-200">
                <option>English</option>
                <option>Hindi</option>
                <option>Gujarati</option>
                <option>Marathi</option>
              </select>
            </div>
          </div>
        )}

        {/* ====== REPORTING TAB ====== */}
        {activeTab === 'reporting' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">📋 Reporting & Activity Logs</h2>

            {/* REPORT TYPE BUTTONS */}
            <div className="space-y-2">
              <button className="w-full bg-white rounded-xl shadow-md p-4 text-left hover:shadow-lg transition-all border-l-4 border-blue-500">
                <p className="font-bold text-gray-900">📝 Crowd Issue Report</p>
                <p className="text-sm text-gray-600 mt-1">Report density, behavior, or safety issues</p>
              </button>
              <button className="w-full bg-white rounded-xl shadow-md p-4 text-left hover:shadow-lg transition-all border-l-4 border-red-500">
                <p className="font-bold text-gray-900">🚨 Incident Report</p>
                <p className="text-sm text-gray-600 mt-1">Document emergencies with photos/video</p>
              </button>
              <button className="w-full bg-white rounded-xl shadow-md p-4 text-left hover:shadow-lg transition-all border-l-4 border-green-500">
                <p className="font-bold text-gray-900">📸 Evidence Upload</p>
                <p className="text-sm text-gray-600 mt-1">Attach photos, video, or audio evidence</p>
              </button>
            </div>

            {/* ACTIVITY SUMMARY */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-bold text-gray-900 mb-3">📊 Today's Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Shift Duration:</span>
                  <span className="font-bold text-gray-900">8 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tasks Completed:</span>
                  <span className="font-bold text-gray-900">12 / 15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Incidents Responded:</span>
                  <span className="font-bold text-gray-900">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Crowd Issue Reports:</span>
                  <span className="font-bold text-gray-900">2</span>
                </div>
                <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-lg transition-all">
                  📥 Download Report
                </button>
              </div>
            </div>

            {/* END SHIFT OPTION */}
            <button className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 px-4 rounded-xl shadow-md hover:shadow-lg transition-all">
              🛑 End Shift & Submit Report
            </button>
          </div>
        )}

        {/* ====== PROFILE & SETTINGS TAB ====== */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">👤 Profile & Access Management</h2>

            {/* WORKER INFO */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-bold text-gray-900 mb-3">📋 Worker Information</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">Full Name</p>
                  <p className="font-bold text-gray-900">{user.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Worker ID</p>
                  <p className="font-bold text-gray-900 font-mono">{user.workerId}</p>
                </div>
                <div>
                  <p className="text-gray-600">Department</p>
                  <p className="font-bold text-gray-900">{user.department}</p>
                </div>
                <div>
                  <p className="text-gray-600">Temple Location</p>
                  <p className="font-bold text-gray-900">{user.templeCity}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-bold text-gray-900 break-all">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-bold text-gray-900">{user.phone}</p>
                </div>
              </div>
            </div>

            {/* ASSIGNED PERMISSIONS */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-bold text-gray-900 mb-3">🔐 Assigned Permissions</h3>
              <div className="space-y-2">
                {['View Crowd Status', 'Respond to SOS', 'Report Issues', 'Access Navigation', 'Emergency Contact'].map((perm, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className="text-sm text-gray-700">{perm}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* EMERGENCY CONTACTS */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="font-bold text-gray-900 mb-3">🚨 Emergency Contacts</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Next of Kin</p>
                  <p className="font-bold text-gray-900">+91 9876543210</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Control Room</p>
                  <p className="font-bold text-gray-900">+91 9999999999</p>
                </div>
              </div>
            </div>

            {/* OFFLINE MODE */}
            <div className="bg-white rounded-xl shadow-md p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900">📲 Offline Mode</p>
                  <p className="text-sm text-gray-600">Use app without internet</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>

            {/* APP GUIDELINES */}
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-all">
              📖 App Usage Guidelines
            </button>
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-lg">
        <div className="flex items-center justify-around px-2 py-2 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'tasks', label: 'Tasks', icon: '✅' },
            { id: 'crowd', label: 'Crowd', icon: '👥' },
            { id: 'navigation', label: 'Navigate', icon: '🗺️' },
            { id: 'emergency', label: 'Emergency', icon: '🚨' },
            { id: 'lostfound', label: 'Lost', icon: '👤' },
            { id: 'communication', label: 'Alerts', icon: '📢' },
            { id: 'reporting', label: 'Report', icon: '📋' },
            { id: 'profile', label: 'Profile', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center px-2 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="text-lg mb-1">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default WorkerDashboard;
