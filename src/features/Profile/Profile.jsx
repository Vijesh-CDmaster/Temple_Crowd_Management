import React, { useState, useEffect } from 'react';

const Profile = () => {
  // Mock data for demonstration
  const user = { fullName: 'Devotee Name', email: 'devotee@example.com' };
  const bookedTickets = [1, 2]; // Mock bookings count
  
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' or 'family'
  
  // Calculate DOB range (from 100 years ago to current year)
  const currentYear = new Date().getFullYear();
  const minDate = `${currentYear - 100}-01-01`; // 100 years back
  const maxDate = `${currentYear}-12-31`; // Current year
  
  // Real data only - from signup + user input
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    devoteeId: `TC${Date.now().toString().slice(-6)}`,
    mobile: '',
    dob: '',
    gender: '',
    addressLine: '',
    city: '',
    state: '',
    country: 'India',
    pincode: ''
  });

  // Family members state
  const [familyMembers, setFamilyMembers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    fullName: '',
    dob: '',
    gender: '',
    relation: '',
    mobile: ''
  });

  // Load saved profile and family data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('templeProfile');
      if (saved) {
        setProfile(JSON.parse(saved));
      }
      
      const savedFamily = localStorage.getItem('familyMembers');
      if (savedFamily) {
        setFamilyMembers(JSON.parse(savedFamily));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewMemberChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddFamilyMember = () => {
    if (!newMember.fullName || !newMember.dob || !newMember.relation) {
      alert('Please fill all required fields (Name, DOB, Relation)');
      return;
    }

    const memberWithId = {
      ...newMember,
      id: Date.now(),
      devoteeId: `TC${Date.now().toString().slice(-6)}`
    };

    const updatedFamily = [...familyMembers, memberWithId];
    setFamilyMembers(updatedFamily);
    localStorage.setItem('familyMembers', JSON.stringify(updatedFamily));
    
    // Reset form
    setNewMember({
      fullName: '',
      dob: '',
      gender: '',
      relation: '',
      mobile: ''
    });
    setShowAddForm(false);
    alert('✅ Family member added successfully! 🙏');
  };

  const handleRemoveFamilyMember = (id) => {
    if (window.confirm('Are you sure you want to remove this family member?')) {
      const updatedFamily = familyMembers.filter(member => member.id !== id);
      setFamilyMembers(updatedFamily);
      localStorage.setItem('familyMembers', JSON.stringify(updatedFamily));
      alert('Family member removed successfully');
    }
  };

  const handleSaveProfile = async () => {
    if (!profile.mobile || !profile.dob || !profile.addressLine || !profile.city || !profile.state || !profile.country || !profile.pincode) {
      alert('Please fill all required fields (*)');
      return;
    }

    setLoading(true);
    try {
      // Save to localStorage (persistent)
      localStorage.setItem('templeProfile', JSON.stringify(profile));
      
      // Update user in localStorage
      const updatedUser = { ...user, fullName: profile.fullName };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert('✅ Profile saved successfully! 🙏');
      setEditMode(false);
    } catch (error) {
      alert('Save failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (editMode) {
      handleSaveProfile();
    } else {
      setEditMode(true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    alert('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full p-2 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl">
              <span className="text-5xl">👤</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
            {profile.fullName || 'Complete Profile'}
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-2xl opacity-90 mb-4">
            <span>ID: <strong className="font-mono bg-white/20 px-4 py-2 rounded-2xl">{profile.devoteeId}</strong></span>
            {profile.mobile && profile.addressLine ? (
              <span className="flex items-center bg-green-500/20 px-4 py-2 rounded-2xl backdrop-blur-sm">
                ✔ Profile Complete
              </span>
            ) : (
              <span className="flex items-center bg-yellow-500/20 px-4 py-2 rounded-2xl backdrop-blur-sm">
                ⚠ Profile Incomplete
              </span>
            )}
          </div>
          <p className="text-xl opacity-90">{profile.email}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl text-center border border-gray-100">
                <div className="text-3xl font-bold text-emerald-600">{bookedTickets.length}</div>
                <div className="text-sm text-gray-600 mt-1">Bookings</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-xl text-center border border-gray-100">
                <div className="text-3xl font-bold text-purple-600">{familyMembers.length}</div>
                <div className="text-sm text-gray-600 mt-1">Family</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full block p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:shadow-xl transition-all text-center font-semibold">
                  Book Darshan →
                </button>
                <button className="w-full flex items-center p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
                  <span className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">🎫</span>
                  My Tickets
                </button>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 text-white font-bold py-4 px-6 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-2 shadow-xl border border-gray-100 mb-6 flex gap-2">
              <button
                onClick={() => setActiveTab('personal')}
                className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                  activeTab === 'personal'
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                👤 Personal Details
              </button>
              <button
                onClick={() => setActiveTab('family')}
                className={`flex-1 py-4 px-6 rounded-2xl font-semibold transition-all duration-300 ${
                  activeTab === 'family'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                👨‍👩‍👧‍👦 Family Members ({familyMembers.length})
              </button>
            </div>

            {/* Personal Details Tab */}
            {activeTab === 'personal' && (
              <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-100">
                {/* Edit Toggle */}
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                    <span className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-2xl mr-4 text-white shadow-lg">👤</span>
                    Profile Details
                  </h2>
                  <button
                    onClick={handleEditToggle}
                    disabled={loading}
                    className={`px-8 py-3 font-semibold rounded-2xl shadow-xl transition-all duration-300 flex items-center space-x-2 ${
                      editMode
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-3xl'
                        : 'bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:shadow-2xl'
                    } disabled:opacity-50`}
                  >
                    {editMode ? (
                      <>
                        <span>💾</span>
                        <span>{loading ? 'Saving...' : 'Save Profile'}</span>
                      </>
                    ) : (
                      <>
                        <span>✏️</span>
                        <span>Edit Profile</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Form Fields */}
                <div className="space-y-8">
                  {/* Personal Information Section */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                      Personal Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={profile.fullName}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm ${
                            editMode
                              ? 'border-gray-200 hover:border-gray-300'
                              : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                          }`}
                        />
                      </div>

                      {/* Mobile */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          value={profile.mobile}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          placeholder="+91 9876543210"
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm ${
                            editMode
                              ? 'border-gray-200 hover:border-gray-300'
                              : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                          }`}
                        />
                      </div>

                      {/* DOB */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="dob"
                          value={profile.dob}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          min={minDate}
                          max={maxDate}
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm ${
                            editMode
                              ? 'border-gray-200 hover:border-gray-300'
                              : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                          }`}
                        />
                        <p className="text-xs text-gray-500 mt-1">For all ages - from infants to seniors</p>
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                        <select
                          name="gender"
                          value={profile.gender}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm ${
                            editMode
                              ? 'border-gray-200 hover:border-gray-300'
                              : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                          }`}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Address Section */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                      Address Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Address Line */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Address Line <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="addressLine"
                          value={profile.addressLine}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          placeholder="House No., Street, Locality"
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm ${
                            editMode
                              ? 'border-gray-200 hover:border-gray-300'
                              : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                          }`}
                        />
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={profile.city}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          placeholder="Enter city"
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm ${
                            editMode
                              ? 'border-gray-200 hover:border-gray-300'
                              : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                          }`}
                        />
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          State <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={profile.state}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          placeholder="Enter state"
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm ${
                            editMode
                              ? 'border-gray-200 hover:border-gray-300'
                              : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                          }`}
                        />
                      </div>

                      {/* Country */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={profile.country}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm ${
                            editMode
                              ? 'border-gray-200 hover:border-gray-300'
                              : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                          }`}
                        />
                      </div>

                      {/* Pincode */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Pincode <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={profile.pincode}
                          onChange={handleInputChange}
                          disabled={!editMode}
                          maxLength="6"
                          placeholder="Enter pincode"
                          className={`w-full p-4 border-2 rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm ${
                            editMode
                              ? 'border-gray-200 hover:border-gray-300'
                              : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Required Notice */}
                <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl">
                  <p className="text-sm text-amber-800">
                    <span className="font-bold">* Required</span> fields are mandatory for booking Darshan tickets
                  </p>
                </div>
              </div>
            )}

            {/* Family Members Tab */}
            {activeTab === 'family' && (
              <div className="space-y-6">
                {/* Add Family Member Button */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center">
                      <span className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl mr-4 text-white shadow-lg">👨‍👩‍👧‍👦</span>
                      Family Members
                    </h2>
                    <button
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center space-x-2"
                    >
                      <span>{showAddForm ? '✕' : '+'}</span>
                      <span>{showAddForm ? 'Cancel' : 'Add Member'}</span>
                    </button>
                  </div>
                </div>

                {/* Add Family Member Form */}
                {showAddForm && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-gray-200">
                      Add New Family Member
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={newMember.fullName}
                          onChange={handleNewMemberChange}
                          placeholder="Enter full name"
                          className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Date of Birth <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="dob"
                          value={newMember.dob}
                          onChange={handleNewMemberChange}
                          min={minDate}
                          max={maxDate}
                          className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={newMember.gender}
                          onChange={handleNewMemberChange}
                          className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Relation <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="relation"
                          value={newMember.relation}
                          onChange={handleNewMemberChange}
                          className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
                        >
                          <option value="">Select Relation</option>
                          <option value="Spouse">Spouse</option>
                          <option value="Father">Father</option>
                          <option value="Mother">Mother</option>
                          <option value="Son">Son</option>
                          <option value="Daughter">Daughter</option>
                          <option value="Brother">Brother</option>
                          <option value="Sister">Sister</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Mobile Number
                        </label>
                        <input
                          type="tel"
                          name="mobile"
                          value={newMember.mobile}
                          onChange={handleNewMemberChange}
                          placeholder="+91 9876543210"
                          className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 transition-all shadow-sm"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleAddFamilyMember}
                      className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      ✓ Add Family Member
                    </button>
                  </div>
                )}

                {/* Family Members List */}
                {familyMembers.length === 0 ? (
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-gray-100 text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-3xl mx-auto mb-6 flex items-center justify-center">
                      <span className="text-5xl">👨‍👩‍👧‍👦</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-3">No Family Members Added</h3>
                    <p className="text-gray-600 mb-6">Add your family members to book tickets together</p>
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all"
                    >
                      + Add First Member
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {familyMembers.map((member) => (
                      <div key={member.id} className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl transition-all">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg">
                              {member.gender === 'Male' ? '👨' : member.gender === 'Female' ? '👩' : '👤'}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{member.fullName}</h3>
                              <p className="text-sm text-gray-600">ID: {member.devoteeId}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveFamilyMember(member.id)}
                            className="text-red-500 hover:text-red-700 font-bold text-xl"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Relation:</span>
                            <span className="font-semibold text-gray-900">{member.relation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">DOB:</span>
                            <span className="font-semibold text-gray-900">{member.dob}</span>
                          </div>
                          {member.gender && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Gender:</span>
                              <span className="font-semibold text-gray-900">{member.gender}</span>
                            </div>
                          )}
                          {member.mobile && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Mobile:</span>
                              <span className="font-semibold text-gray-900">{member.mobile}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;