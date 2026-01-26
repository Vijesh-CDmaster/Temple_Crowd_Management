import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
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
      
      // Mock authentication (replace with real API)
      const mockUsers = [
        { email: 'devotee@example.com', password: 'Devotee@123', fullName: 'Shri Devotee' },
        { email: 'admin@templeconnect.com', password: 'Admin@2024', fullName: 'Temple Admin' }
      ];
      
      const user = mockUsers.find(u => 
        u.email === formData.email && u.password === formData.password
      );
      
      if (!user) {
        setFailedAttempts(prev => prev + 1);
        setErrors({ submit: failedAttempts >= 2 ? 'Account locked. Try Forgot Password.' : 'Invalid email or password.' });
        return;
      }
      
      // Success - login user
      const mockToken = `temple-jwt-${Date.now()}-${user.email}`;
      const userData = {
        id: Date.now(),
        fullName: user.fullName,
        email: user.email,
        role: user.email.includes('admin') ? 'admin' : 'user'
      };
      
      login(userData, mockToken);
      
      // Redirect based on role
      if (formData.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      setTimeout(() => {
        navigate(user.role === 'admin' ? '/admin' : '/temples');
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
    <div className="min-h-screen bg-gradient-to-br from-temple-beige via-white to-orange-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-gray-100 relative">
        {/* Admin Menu Icon (Three Dots) */}
        <div className="absolute top-6 right-6">
          <button
            onClick={() => setShowAdminMenu(!showAdminMenu)}
            className="p-2 hover:bg-gray-100 rounded-full transition-all"
            title="Admin Menu"
          >
            <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {showAdminMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50">
              <div className="px-4 py-2 bg-gradient-to-r from-red-50 to-orange-50 rounded-t-2xl border-b border-gray-100">
                <p className="text-xs font-bold text-red-600 uppercase">Admin Portal</p>
              </div>
              <Link
                to="/admin-signin"
                onClick={() => setShowAdminMenu(false)}
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-red-50 font-semibold border-b border-gray-100 flex items-center gap-2"
              >
                🔐 Admin Sign In
              </Link>
              <Link
                to="/admin-signup"
                onClick={() => setShowAdminMenu(false)}
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-red-50 font-semibold border-b border-gray-100 flex items-center gap-2"
              >
                📝 Admin Sign Up
              </Link>

              <div className="px-4 py-2 bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100">
                <p className="text-xs font-bold text-purple-600 uppercase">Worker Portal</p>
              </div>
              <Link
                to="/worker-signin"
                onClick={() => setShowAdminMenu(false)}
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 font-semibold border-b border-gray-100 flex items-center gap-2"
              >
                👷 Worker Sign In
              </Link>
              <Link
                to="/worker-signup"
                onClick={() => setShowAdminMenu(false)}
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 rounded-b-2xl font-semibold flex items-center gap-2"
              >
                📋 Worker Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <span className="text-3xl">🔐</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-temple-dark bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to continue your divine journey</p>
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
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="devotee@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading || failedAttempts >= 3}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all shadow-sm ${
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
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all shadow-sm ${
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={loading || failedAttempts >= 3}
                className="w-5 h-5 text-temple-gold rounded border-gray-300 focus:ring-temple-gold"
              />
              <span className="ml-3 text-sm text-gray-700">Remember me</span>
            </label>
            <button
              onClick={handleForgotPassword}
              disabled={!formData.email || loading}
              className="text-sm font-semibold text-temple-gold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-xl"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </>
            ) : (
              'Sign In'
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
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="font-bold text-temple-gold hover:underline text-base"
            >
              Create Account →
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl text-xs text-center">
          <p className="font-semibold text-blue-800 mb-1">📱 Demo Login:</p>
          <p><strong>devotee@example.com</strong> / <strong>Devotee@123</strong></p>
          <p className="text-blue-700 mt-1">Click "Forgot Password?" for reset flow</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
