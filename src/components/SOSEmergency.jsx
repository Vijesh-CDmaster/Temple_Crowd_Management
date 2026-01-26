import React, { useState } from 'react';

const SOSEmergency = () => {
  const [showModal, setShowModal] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const handleSOS = () => {
    setShowModal(true);
  };

  const sendEmergency = (type) => {
    // Simulate sending SOS alert
    const location = "Temple Location - Auto-shared";
    const message = `Emergency: ${type} - Location: ${location} - Timestamp: ${new Date().toLocaleTimeString()}`;
    
    alert(`🚨 Emergency alert sent!\n\n${message}\n\nNearest medical team and staff are being notified.`);
    setAlertSent(true);
    
    setTimeout(() => {
      setShowModal(false);
      setAlertSent(false);
    }, 2000);
  };

  const closeModal = () => {
    setShowModal(false);
    setAlertSent(false);
  };

  return (
    <>
      {/* Floating SOS Button */}
      <button
        onClick={handleSOS}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center font-bold text-xl animate-pulse border-4 border-white"
        title="Press for Emergency Help"
      >
        🚨
      </button>

      {/* SOS Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-bounce">
            {!alertSent ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                    <span className="text-4xl">🚨</span>
                  </div>
                  <h2 className="text-2xl font-bold text-red-600 mb-2">Emergency Help</h2>
                  <p className="text-gray-600">Your location will be automatically shared</p>
                </div>

                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => sendEmergency('Medical Emergency')}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-2xl transition-all"
                  >
                    🏥 Medical Help
                  </button>
                  <button
                    onClick={() => sendEmergency('Lost/Separated')}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-2xl transition-all"
                  >
                    👥 Lost/Separated
                  </button>
                  <button
                    onClick={() => sendEmergency('Crowd Danger')}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-2xl transition-all"
                  >
                    ⚠️ Crowd Danger
                  </button>
                  <button
                    onClick={() => sendEmergency('Security Issue')}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-2xl transition-all"
                  >
                    🔒 Security Issue
                  </button>
                </div>

                <button
                  onClick={closeModal}
                  className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-2xl transition-all"
                >
                  Cancel
                </button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">✅</span>
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Alert Sent!</h3>
                <p className="text-gray-600">Help is on the way. Staff will reach you shortly.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SOSEmergency;
