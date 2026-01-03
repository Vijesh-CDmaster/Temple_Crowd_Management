import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './VirtualQueue.css';

const VirtualQueue = () => {
  const [step, setStep] = useState(1);
  const [temples, setTemples] = useState([]);
  const [selectedTemple, setSelectedTemple] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    devoteeCount: 1,
    specialRequest: '',
    emergencyContact: ''
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setTemples([
        {
          _id: '1',
          name: 'Somnath Temple',
          city: 'Veraval',
          description: 'First of the 12 Jyotirlingas, sacred shrine of Lord Shiva',
          timings: '6AM - 9PM',
          distance: '320 km from Ahmedabad',
          icon: '🛕',
          slots: [
            { time: '10:30 AM', price: 50, available: true },
            { time: '2:00 PM', price: 100, available: true },
            { time: '6:00 PM', price: 150, available: false }
          ]
        },
        {
          _id: '2',
          name: 'Dwarka Temple',
          city: 'Dwarka',
          description: 'Ancient temple of Lord Krishna, one of Char Dham',
          timings: '6AM - 8:30PM',
          distance: '430 km from Ahmedabad',
          icon: '🛕',
          slots: [
            { time: '9:00 AM', price: 75, available: true },
            { time: '12:30 PM', price: 125, available: true },
            { time: '4:30 PM', price: 200, available: true }
          ]
        },
        {
          _id: '3',
          name: 'Akshardham Temple',
          city: 'Gandhinagar',
          description: 'Magnificent Swaminarayan temple with intricate carvings',
          timings: '10AM - 7PM (Closed Mon)',
          distance: '25 km from Ahmedabad',
          icon: '🛕',
          slots: [
            { time: '11:00 AM', price: 30, available: true },
            { time: '3:00 PM', price: 50, available: false },
            { time: '5:30 PM', price: 75, available: true }
          ]
        },
        {
          _id: '4',
          name: 'Ambaji Temple',
          city: 'Ambaji',
          description: 'One of 51 Shakti Peethas, dedicated to Goddess Amba',
          timings: '6AM - 9PM',
          distance: '180 km from Ahmedabad',
          icon: '🛕',
          slots: [
            { time: '8:00 AM', price: 25, available: true },
            { time: '12:00 PM', price: 25, available: true },
            { time: '4:00 PM', price: 40, available: true }
          ]
        },
        {
          _id: '5',
          name: 'Pavagarh Kalika Mata',
          city: 'Pavagadh',
          description: 'Ancient hilltop temple, UNESCO World Heritage Site',
          timings: '7AM - 8PM',
          distance: '150 km from Ahmedabad',
          icon: '🛕',
          slots: [
            { time: '7:30 AM', price: 25, available: true },
            { time: '11:00 AM', price: 25, available: true },
            { time: '3:00 PM', price: 40, available: true }
          ]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const bookDarshan = async () => {
    setLoading(true);
    try {
      // Generate token
      const token = `TKN-${new Date().toISOString().slice(2,10).replace(/-/g,'')}-${Math.floor(Math.random()*999).toString().padStart(3,'0')}`;
      
      // Parse slot time
      const [time, period] = selectedSlot.time.split(' ');
      const [hours, minutes] = time.split(':');
      let hour24 = parseInt(hours);
      if (period === 'PM' && hour24 !== 12) hour24 += 12;
      if (period === 'AM' && hour24 === 12) hour24 = 0;
      
      const slotDateTime = new Date();
      slotDateTime.setHours(hour24, parseInt(minutes), 0, 0);
      
      // Calculate expiry (45 minutes after slot time)
      const expiresAt = new Date(slotDateTime.getTime() + 45 * 60000);
      
      // Prepare booking data
      const bookingData = {
        templeId: selectedTemple._id,
        templeName: selectedTemple.name,
        slotTime: slotDateTime.toISOString(),
        token: token,
        price: selectedSlot.price * formData.devoteeCount,
        devoteeCount: formData.devoteeCount,
        specialRequest: formData.specialRequest,
        emergencyContact: formData.emergencyContact,
        status: 'active',
        expiresAt: expiresAt.toISOString(),
        qrCode: token
      };
      
      console.log('📤 Sending booking data:', bookingData);
      
      // Try to send to MongoDB backend
      try {
        const response = await fetch('http://localhost:5000/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData)
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ Server error:', response.status, errorData);
          throw new Error(errorData.message || 'Booking failed on server');
        }
        
        const result = await response.json();
        console.log('✅ Booking successful (MongoDB):', result);
        
      } catch (backendError) {
        console.error('⚠️ Backend unavailable, using localStorage fallback:', backendError);
        
        // Fallback: Save to localStorage for testing
        const localBooking = {
          _id: Date.now().toString(),
          templeId: { name: selectedTemple.name },
          slotTime: slotDateTime.toISOString(),
          token: token,
          price: selectedSlot.price * formData.devoteeCount,
          status: 'active',
          expiresAt: expiresAt.toISOString(),
          qrCode: token
        };
        
        // Get existing tokens from localStorage
        const existingTokens = JSON.parse(localStorage.getItem('localTokens') || '[]');
        existingTokens.unshift(localBooking);
        localStorage.setItem('localTokens', JSON.stringify(existingTokens));
        
        console.log('💾 Saved to localStorage:', localBooking);
        alert('⚠️ Backend unavailable. Token saved locally for demo purposes.');
      }
      
      // Navigate to tokens page
      navigate('/my-tokens', { 
        state: { 
          newToken: {
            temple: selectedTemple.name,
            time: selectedSlot.time,
            token: token,
            status: 'active'
          },
          refresh: true
        }
      });
      
    } catch (error) {
      console.error('❌ Booking error:', error);
      alert(`❌ Booking failed: ${error.message}\n\nPlease check:\n1. Backend server is running\n2. Port 5000 is accessible\n3. Check browser console for details`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-6"></div>
          <p className="text-xl text-amber-800 font-semibold">Loading temples...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent mb-6">
            Virtual Queue
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Book your darshan slot instantly. Skip the long queues.
          </p>
          <div className="flex justify-center items-center space-x-2 mt-12">
            {[1,2,3,4].map(i => (
              <div key={i} className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all ${
                step >= i ? 'bg-amber-500 text-white shadow-lg' : 'bg-gray-200 text-gray-500'
              }`}>
                {i}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Select Temple */}
        {step === 1 && (
          <div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {temples.map(temple => (
                <div key={temple._id} className="temple-card">
                  <div className="temple-card-header">
                    <div className="temple-icon-wrapper">
                      <span className="temple-icon">{temple.icon}</span>
                    </div>
                  </div>
                  
                  <div className="temple-card-body">
                    <h3 className={`temple-name ${temple._id === '2' ? 'temple-name-gold' : ''}`}>
                      {temple.name}
                    </h3>
                    
                    <div className="temple-location">
                      <span className="location-pin">📍</span>
                      <span>{temple.city}</span>
                    </div>
                    
                    <p className="temple-description">{temple.description}</p>
                    
                    <div className="temple-info">
                      <div className="info-item">
                        <span className="info-icon">🕐</span>
                        <span className="info-text">{temple.timings}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-icon">📍</span>
                        <span className="info-text">{temple.distance}</span>
                      </div>
                    </div>
                    
                    <div className="available-slots-section">
                      <h4 className="slots-heading">Available Slots</h4>
                      <div className="slots-grid">
                        {temple.slots.map((slot, idx) => (
                          <button
                            key={idx}
                            className={`slot-button ${!slot.available ? 'slot-unavailable' : ''}`}
                            disabled={!slot.available}
                          >
                            <span className="slot-time">{slot.time}</span>
                            <span className="slot-price">(₹{slot.price})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <button 
                      className="book-darshan-btn"
                      onClick={() => {
                        setSelectedTemple(temple);
                        setStep(2);
                      }}
                    >
                      Book Darshan →
                    </button>
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
            
            <div className="mb-12 p-8 bg-gradient-to-r from-amber-100/50 to-orange-100/30 rounded-2xl border-2 border-dashed border-amber-200/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedTemple.name}</h3>
              <p className="text-lg text-gray-700">Choose your preferred darshan time</p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedTemple.slots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => slot.available && setSelectedSlot(slot)}
                  disabled={!slot.available}
                  className={`p-8 rounded-2xl font-bold text-lg shadow-xl transition-all border-4 ${
                    selectedSlot === slot
                      ? 'bg-amber-500 text-white border-amber-500 shadow-2xl scale-105'
                      : slot.available
                      ? 'bg-green-100 text-green-800 border-green-300 hover:scale-105'
                      : 'bg-gray-100 text-gray-500 border-gray-300 line-through opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="text-3xl mb-4">{slot.time}</div>
                  <div className="text-2xl font-black">₹{slot.price}</div>
                  {!slot.available && <div className="text-sm mt-2">Sold Out</div>}
                </button>
              ))}
            </div>

            <div className="flex justify-center mt-12">
              <button
                onClick={() => selectedSlot && setStep(3)}
                disabled={!selectedSlot}
                className="px-12 py-4 bg-amber-500 hover:bg-amber-600 text-white text-xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="bg-gradient-to-br from-amber-50 p-8 rounded-2xl border border-amber-200/50">
                <h3 className="text-xl font-bold mb-6">Booking Summary</h3>
                <div className="space-y-4 text-lg">
                  <div><span className="font-semibold">Temple:</span> {selectedTemple.name}</div>
                  <div><span className="font-semibold">Time:</span> {selectedSlot.time}</div>
                  <div><span className="font-semibold">Price per person:</span> ₹{selectedSlot.price}</div>
                  <div className="text-2xl font-bold text-amber-600 pt-4 border-t border-amber-200">
                    Total: ₹{selectedSlot.price * formData.devoteeCount}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-6">Devotee Details</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Number of Devotees</label>
                    <select
                      value={formData.devoteeCount}
                      onChange={(e) => setFormData({...formData, devoteeCount: parseInt(e.target.value)})}
                      className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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
                      className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Emergency Contact</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                      className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setStep(4)}
                className="px-16 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 text-white text-xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl transition-all"
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
              className="w-full max-w-md mx-auto px-12 py-5 bg-amber-500 hover:bg-amber-600 text-white text-xl font-bold rounded-3xl shadow-2xl hover:shadow-3xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
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