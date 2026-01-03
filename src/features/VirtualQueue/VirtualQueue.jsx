import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VirtualQueue = () => {
  const [step, setStep] = useState(1); // 1: Select, 2: Slots, 3: Details, 4: Confirm
  const [selectedTemple, setSelectedTemple] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    devoteeCount: 1,
    specialRequest: '',
    emergencyContact: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Temple data with live slots
  const temples = [
    {
      id: 1,
      name: 'Somnath Temple',
      location: 'Veraval',
      nextSlots: [
        { time: '10:30 AM', slotsLeft: 45, duration: '45 mins', price: '₹50' },
        { time: '12:00 PM', slotsLeft: 23, duration: '45 mins', price: '₹50' },
        { time: '2:30 PM', slotsLeft: 67, duration: '45 mins', price: '₹100' },
        { time: '5:00 PM', slotsLeft: 12, duration: '45 mins', price: '₹150' }
      ]
    },
    {
      id: 2,
      name: 'Dwarka Temple',
      location: 'Dwarka',
      nextSlots: [
        { time: '9:00 AM', slotsLeft: 34, duration: '30 mins', price: '₹75' },
        { time: '11:30 AM', slotsLeft: 56, duration: '30 mins', price: '₹75' },
        { time: '4:00 PM', slotsLeft: 78, duration: '30 mins', price: '₹125' }
      ]
    }
  ];

  const bookDarshan = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful booking
    const token = `TKN-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*999).toString().padStart(3,'0')}`;
    
    setLoading(false);
    navigate('/my-tokens', { 
      state: { 
        newToken: {
          temple: selectedTemple.name,
          time: selectedSlot.time,
          token,
          status: 'active'
        }
      }
    });
  };

  const getSlotColor = (slotsLeft) => {
    if (slotsLeft === 0) return 'bg-gray-100 text-gray-500 line-through';
    if (slotsLeft < 10) return 'bg-red-100 text-red-800 border-red-300';
    if (slotsLeft < 30) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-beige to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-temple-gold to-amber-600 bg-clip-text text-transparent mb-6">
            Virtual Queue
          </h1>
          <p className="text-xl text-temple-dark/70 max-w-2xl mx-auto">
            Book your darshan slot instantly. Skip the long queues.
          </p>
          {/* Progress Bar */}
          <div className="flex justify-center items-center space-x-2 mt-12">
            {[1,2,3,4].map(i => (
              <div key={i} className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all ${
                step >= i 
                  ? 'bg-temple-gold text-white shadow-lg' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {i}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Select Temple */}
        {step === 1 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Select Temple</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {temples.map(temple => (
                <div 
                  key={temple.id}
                  className="group bg-gradient-to-br from-white to-temple-beige/30 p-8 rounded-2xl border-2 border-white/50 hover:border-temple-gold/50 cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-2"
                  onClick={() => {
                    setSelectedTemple(temple);
                    setStep(2);
                  }}
                >
                  <div className="w-24 h-24 bg-temple-gold rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                    <span className="text-3xl">🛕</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center group-hover:text-temple-gold">{temple.name}</h3>
                  <p className="text-gray-600 text-center mb-6">{temple.location}</p>
                  <div className="flex items-center justify-center text-sm text-temple-dark/70">
                    <span className="mr-2">🎫</span>
                    <span>Live slots available</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Slot */}
        {step === 2 && selectedTemple && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12">
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setStep(1)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                <span>←</span> <span>Change Temple</span>
              </button>
              <h2 className="text-3xl font-bold text-gray-900">Select Slot</h2>
            </div>
            
            <div className="mb-12 p-8 bg-gradient-to-r from-temple-gold/10 to-temple-beige/30 rounded-2xl border-2 border-dashed border-temple-gold/30">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedTemple.name}</h3>
              <p className="text-lg text-temple-dark/70">Choose your preferred darshan time</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {selectedTemple.nextSlots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedSlot(slot)}
                  disabled={slot.slotsLeft === 0}
                  className={`p-8 rounded-2xl font-bold text-lg shadow-xl transition-all group border-4 ${
                    selectedSlot === slot
                      ? 'bg-temple-gold text-white border-temple-gold shadow-2xl scale-105'
                      : getSlotColor(slot.slotsLeft)
                  } hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="text-3xl mb-4">{slot.time}</div>
                  <div className="text-2xl font-black">{slot.slotsLeft}</div>
                  <div className="text-sm opacity-75 mt-2">slots left</div>
                  <div className="text-xl mt-3">{slot.duration}</div>
                  <div className="text-lg font-semibold mt-2">₹{slot.price}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <button
                onClick={() => selectedSlot && setStep(3)}
                disabled={!selectedSlot}
                className="px-12 py-4 bg-temple-gold hover:bg-opacity-90 text-white text-xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Details →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Devotee Details */}
        {step === 3 && selectedTemple && selectedSlot && (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12">
            <div className="flex items-center justify-between mb-8">
              <button onClick={() => setStep(2)} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <span>←</span> <span>Change Slot</span>
              </button>
              <h2 className="text-3xl font-bold text-gray-900">Booking Details</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Summary */}
              <div className="bg-gradient-to-br from-temple-gold/10 p-8 rounded-2xl border border-temple-gold/20">
                <h3 className="text-xl font-bold mb-6">Booking Summary</h3>
                <div className="space-y-4 text-lg">
                  <div><span className="font-semibold">Temple:</span> {selectedTemple.name}</div>
                  <div><span className="font-semibold">Time:</span> {selectedSlot.time}</div>
                  <div><span className="font-semibold">Duration:</span> {selectedSlot.duration}</div>
                  <div><span className="font-semibold">Price:</span> ₹{selectedSlot.price}</div>
                  <div className="text-2xl font-bold text-temple-gold pt-4 border-t-top border-temple-gold/30">
                    Total: ₹{selectedSlot.price}
                  </div>
                </div>
              </div>

              {/* Form */}
              <div>
                <h3 className="text-xl font-bold mb-6">Devotee Details</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Number of Devotees</label>
                    <select
                      value={formData.devoteeCount}
                      onChange={(e) => setFormData({...formData, devoteeCount: parseInt(e.target.value)})}
                      className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-temple-gold focus:border-transparent"
                    >
                      {[1,2,3,4,5].map(n => (
                        <option key={n} value={n}>{n} Devotee{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Special Requests</label>
                    <textarea
                      placeholder="Elderly, children, VIP pass etc."
                      value={formData.specialRequest}
                      onChange={(e) => setFormData({...formData, specialRequest: e.target.value})}
                      rows={3}
                      className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-temple-gold focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Emergency Contact</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                      className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-temple-gold focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setStep(4)}
                className="px-16 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-opacity-90 text-white text-xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl transition-all px-12"
              >
                Confirm & Book →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && selectedTemple && selectedSlot && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-3xl p-16 text-center max-w-2xl mx-auto">
            <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-emerald-400 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent mb-6">
              Booking Confirmed!
            </h2>
            <p className="text-xl text-gray-700 mb-12">Your token has been generated successfully</p>
            
            <button
              onClick={bookDarshan}
              disabled={loading}
              className="w-full max-w-md mx-auto px-12 py-5 bg-temple-gold hover:bg-opacity-90 text-white text-xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 mx-auto"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Finalizing...</span>
                </>
              ) : (
                'View My Token →'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualQueue;
