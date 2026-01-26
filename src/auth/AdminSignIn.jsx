import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminSignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    verificationCode: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear errors on input
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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.verificationCode.trim()) {
      newErrors.verificationCode = 'Verification code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get stored admin data with verification code
      const adminDataStr = localStorage.getItem('adminData');
      const adminData = adminDataStr ? JSON.parse(adminDataStr) : null;

      // Check if verification code matches
      if (!adminData || adminData.verificationCode !== formData.verificationCode) {
        setFailedAttempts(prev => prev + 1);
        setErrors({ verificationCode: failedAttempts >= 2 ? 'Invalid verification code. Account locked. Contact support.' : 'Invalid verification code.' });
        return;
      }
      
      // Mock authentication (replace with real API)
      const mockAdmins = [
        { email: 'admin@templeconnect.com', password: 'Admin@2024', fullName: 'Temple Admin' },
        { email: 'superadmin@templeconnect.com', password: 'SuperAdmin@2024', fullName: 'Super Admin' }
      ];
      
      const admin = mockAdmins.find(a => 
        a.email === formData.email && a.password === formData.password
      );
      
      if (!admin) {
        setFailedAttempts(prev => prev + 1);
        setErrors({ submit: failedAttempts >= 2 ? 'Account locked. Try Forgot Password.' : 'Invalid email or password.' });
        return;
      }
      
      // Success - login admin
      const mockToken = `temple-admin-jwt-${Date.now()}-${admin.email}`;
      const adminLoginData = {
        id: Date.now(),
        fullName: admin.fullName,
        email: admin.email,
        role: 'admin',
        templeId: adminData?.templeId || '',
        templeName: adminData?.templeName || '',
        templeCity: adminData?.templeCity || '',
        templeState: adminData?.templeState || '',
        verificationCode: formData.verificationCode
      };
      
      login(adminLoginData, mockToken);
      
      // Redirect to admin dashboard
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 1000);
      
    } catch (error) {
      setErrors({ submit: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (formData.email) {
      alert(`Password reset link sent to ${formData.email}`);
      // Navigate to reset page
    } else {
      setErrors({ email: 'Enter your email first' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <span className="text-3xl">👨‍💼</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-900 to-orange-800 bg-clip-text text-transparent mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600">Sign in to manage temples</p>
        </div>

        {/* Failed Attempts Warning */}
        {failedAttempts >= 3 && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-2xl mb-6 text-sm">
            Account temporarily locked. Please use{' '}
            <button 
              onClick={handleForgotPassword}
              className="font-semibold underline hover:no-underline"
            >
              Forgot Password
            </button>
            .
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Admin Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="admin@templeconnect.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading || failedAttempts >= 3}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm ${
                  errors.email 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${loading || failedAttempts >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <div className="absolute left-4 top-5 text-gray-400">📧</div>
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="w-4 h-4 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading || failedAttempts >= 3}
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm ${
                  errors.password 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${loading || failedAttempts >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <div className="absolute left-4 top-5 text-gray-400">🔒</div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading || failedAttempts >= 3}
                className="absolute right-4 top-5 text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="w-4 h-4 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                {errors.password}
              </p>
            )}
          </div>

          {/* Verification Code Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🔐 Admin ID Verification Code
            </label>
            <div className="relative">
              <input
                type="text"
                name="verificationCode"
                placeholder="e.g., ID001, ID002, ..."
                value={formData.verificationCode}
                onChange={handleInputChange}
                disabled={loading || failedAttempts >= 3}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm font-mono ${
                  errors.verificationCode 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${loading || failedAttempts >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <div className="absolute left-4 top-5 text-gray-400">🏛️</div>
            </div>
            {errors.verificationCode && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="w-4 h-4 bg-red-500 rounded-full mr-2 flex-shrink-0"></span>
                {errors.verificationCode}
              </p>
            )}
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
              <p className="font-semibold">📋 Valid Admin IDs:</p>
              <p>ID001, ID002, ID003, ID004, ID005, ID006, ID007</p>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={loading || failedAttempts >= 3}
                className="w-5 h-5 text-red-500 rounded border-gray-300 focus:ring-red-500"
              />
              <span className="ml-3 text-sm text-gray-700">Remember me</span>
            </label>
            <button
              onClick={handleForgotPassword}
              disabled={!formData.email || loading}
              className="text-sm font-semibold text-red-600 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Forgot Password?
            </button>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-2xl text-sm">
              {errors.submit}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!formData.email || !formData.password || loading || failedAttempts >= 3}
            className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-xl"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </>
            ) : (
              'Admin Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/90 text-gray-500">OR</span>
          </div>
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Don't have an admin account?{' '}
            <Link 
              to="/admin-signup" 
              className="font-bold text-red-600 hover:underline text-base"
            >
              Create Admin Account →
            </Link>
          </p>
        </div>

        {/* Back to User Login */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <Link 
            to="/signin" 
            className="text-sm text-gray-600 hover:text-gray-900 font-semibold"
          >
            ← Back to User Sign In
          </Link>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-red-50 border-2 border-red-200 rounded-2xl text-xs text-center">
          <p className="font-semibold text-red-800 mb-1">👨‍💼 Demo Admin Login:</p>
          <p><strong>admin@templeconnect.com</strong> / <strong>Admin@2024</strong></p>
          <p className="text-red-700 mt-1">Click "Forgot Password?" for reset flow</p>
        </div>
      </div>
    </div>
  );
};

export default AdminSignIn;
