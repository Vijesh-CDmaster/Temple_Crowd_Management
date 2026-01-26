import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const WorkerSignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    workerCode: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    if (!formData.workerCode.trim()) {
      newErrors.workerCode = 'Worker code is required';
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

      // Get worker data from localStorage
      const workerData = localStorage.getItem(`worker_${formData.email}`);

      if (!workerData) {
        setFailedAttempts(prev => prev + 1);
        setErrors({ submit: 'Worker account not found' });
        return;
      }

      const worker = JSON.parse(workerData);

      if (worker.password !== formData.password) {
        setFailedAttempts(prev => prev + 1);
        setErrors({ submit: failedAttempts >= 2 ? 'Account locked. Try Forgot Password.' : 'Invalid password' });
        return;
      }

      if (worker.workerCode !== formData.workerCode.toUpperCase()) {
        setFailedAttempts(prev => prev + 1);
        setErrors({ submit: 'Invalid worker code' });
        return;
      }

      // Success - login worker
      const mockToken = `worker-jwt-${Date.now()}-${formData.email}`;
      const userData = {
        id: worker.id,
        fullName: worker.fullName,
        email: worker.email,
        phone: worker.phone,
        workerId: worker.workerId,
        department: worker.department,
        templeCity: worker.templeCity,
        role: 'worker'
      };

      login(userData, mockToken);

      setTimeout(() => {
        navigate('/worker-dashboard');
      }, 1000);

    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <span className="text-3xl">👷</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Worker Portal</h1>
          <p className="text-gray-600">Sign in to manage temple operations</p>
        </div>

        {/* Failed Attempts Warning */}
        {failedAttempts >= 3 && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-2xl mb-6 text-sm">
            Account temporarily locked. Please use Forgot Password or contact admin.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="worker@temple.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading || failedAttempts >= 3}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              <div className="absolute left-4 top-5 text-gray-400">📧</div>
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading || failedAttempts >= 3}
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              <div className="absolute left-4 top-5 text-gray-400">🔒</div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || failedAttempts >= 3}
                className="absolute right-4 top-5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Worker Code Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Worker Code</label>
            <div className="relative">
              <input
                type="text"
                name="workerCode"
                placeholder="WORKER1A2B3C4D5E"
                value={formData.workerCode}
                onChange={handleInputChange}
                disabled={loading || failedAttempts >= 3}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm font-mono ${
                  errors.workerCode ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              <div className="absolute left-4 top-5 text-gray-400">🔐</div>
            </div>
            {errors.workerCode && <p className="text-red-500 text-sm mt-1">{errors.workerCode}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || failedAttempts >= 3}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl mt-8 transition-all disabled:opacity-50 shadow-lg"
          >
            {loading ? 'Signing In...' : 'Sign In to Worker Portal'}
          </button>
        </form>

        {/* Error Messages */}
        {errors.submit && (
          <div className="mt-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-2xl text-sm">
            {errors.submit}
          </div>
        )}

        {/* Footer Links */}
        <div className="mt-8 flex items-center justify-between text-sm">
          <button
            onClick={() => alert('Feature coming soon')}
            className="text-purple-600 hover:underline font-semibold"
          >
            Forgot Password?
          </button>
          <span className="text-gray-600">|</span>
          <Link to="/worker-signup" className="text-purple-600 hover:underline font-semibold">
            New Worker?
          </Link>
        </div>

        {/* Back to User Login */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Link
            to="/signin"
            className="block text-center text-gray-600 hover:text-gray-900 font-semibold"
          >
            ← Back to User Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WorkerSignIn;
