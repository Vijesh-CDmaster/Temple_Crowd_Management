import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const WorkerSignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    templeId: '',
    templeCity: '',
    workerId: '',
    department: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [workerCode, setWorkerCode] = useState('');

  const departments = ['Security', 'Ground Maintenance', 'Queue Management', 'Hospitality', 'Medical', 'Administration'];

  const generateWorkerCode = () => {
    return 'WORKER' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePassword = (password) => {
    const rules = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*]/.test(password)
    };
    return rules;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    if (!formData.templeId.trim()) {
      newErrors.templeId = 'Temple ID is required';
    }

    if (!formData.templeCity.trim()) {
      newErrors.templeCity = 'Temple city is required';
    }

    if (!formData.workerId.trim()) {
      newErrors.workerId = 'Worker ID is required';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const rules = validatePassword(formData.password);
      if (!Object.values(rules).every(v => v)) {
        newErrors.password = 'Password must have uppercase, lowercase, number, and special character';
      }
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const generatedCode = generateWorkerCode();
      setWorkerCode(generatedCode);

      // Store worker data in localStorage
      const workerData = {
        id: Date.now(),
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        templeId: formData.templeId,
        templeCity: formData.templeCity,
        workerId: formData.workerId,
        department: formData.department,
        password: formData.password,
        workerCode: generatedCode,
        registeredAt: new Date().toISOString(),
        role: 'worker'
      };

      localStorage.setItem(`worker_${formData.email}`, JSON.stringify(workerData));
      localStorage.setItem('workerSignupSuccess', 'true');

      setShowSuccessScreen(true);
    } catch (error) {
      setErrors({ submit: 'Sign up failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(workerCode);
    alert('Worker code copied to clipboard!');
  };

  if (showSuccessScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-2xl border border-gray-100 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-4xl">✅</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">Signup Successful!</h2>
          <p className="text-gray-600 mb-6">Welcome to TempleConnect Worker Portal</p>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 mb-8 border-2 border-purple-200">
            <p className="text-sm text-gray-600 mb-2">Your Worker Authentication Code</p>
            <p className="text-2xl font-bold text-purple-600 mb-4 font-mono">{workerCode}</p>
            <p className="text-xs text-gray-600 mb-4">Keep this code safe. You'll need it to sign in.</p>
            <button
              onClick={handleCopyCode}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transition-all"
            >
              📋 Copy Code
            </button>
          </div>

          <Link
            to="/worker-signin"
            className="block w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
          >
            Go to Worker Sign In
          </Link>

          <p className="text-sm text-gray-600 mt-4">
            Already have an account?{' '}
            <Link to="/worker-signin" className="text-purple-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <span className="text-2xl">👷</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Worker Sign Up</h1>
          <p className="text-gray-600 text-sm">Join the Temple Management Team</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="worker@temple.com"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Temple ID & City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Temple ID</label>
              <input
                type="text"
                name="templeId"
                placeholder="TEMPLE001"
                value={formData.templeId}
                onChange={handleInputChange}
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.templeId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.templeId && <p className="text-red-500 text-xs mt-1">{errors.templeId}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="templeCity"
                placeholder="Dwarka"
                value={formData.templeCity}
                onChange={handleInputChange}
                disabled={loading}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.templeCity ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.templeCity && <p className="text-red-500 text-xs mt-1">{errors.templeCity}</p>}
            </div>
          </div>

          {/* Worker ID */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Worker ID (Employee ID)</label>
            <input
              type="text"
              name="workerId"
              placeholder="EMP12345"
              value={formData.workerId}
              onChange={handleInputChange}
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.workerId ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.workerId && <p className="text-red-500 text-xs mt-1">{errors.workerId}</p>}
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.department ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 text-sm"
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              disabled={loading}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 rounded-lg mt-6 transition-all disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : '✓ Create Worker Account'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/worker-signin" className="text-purple-600 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default WorkerSignUp;
