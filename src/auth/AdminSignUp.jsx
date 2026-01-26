import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminSignUp = () => {
  const temples = [
    { id: 'ID001', name: 'Somnath Temple', city: 'Veraval', state: 'Gujarat' },
    { id: 'ID002', name: 'Dwarka Temple', city: 'Dwarka', state: 'Gujarat' },
    { id: 'ID003', name: 'Varanasi Temple', city: 'Varanasi', state: 'Uttar Pradesh' },
    { id: 'ID004', name: 'Ujjain Temple', city: 'Ujjain', state: 'Madhya Pradesh' },
    { id: 'ID005', name: 'Haridwar Temple', city: 'Haridwar', state: 'Uttarakhand' },
    { id: 'ID006', name: 'Mathura Temple', city: 'Mathura', state: 'Uttar Pradesh' },
    { id: 'ID007', name: 'Ayodhya Temple', city: 'Ayodhya', state: 'Uttar Pradesh' }
  ];

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    templeId: '',
    templeName: '',
    templeCity: '',
    templeState: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [strength, setStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [selectedTemple, setSelectedTemple] = useState(null);
  const navigate = useNavigate();

  const generateVerificationCode = (templeId) => {
    return templeId || 'ID001';
  };

  const validatePassword = (password) => {
    const rules = {
      minLength: password.length >= 8,
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    const score = Object.values(rules).filter(Boolean).length;
    return { rules, score, valid: score === 4 };
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (name === 'password') {
      const { score } = validatePassword(value);
      setStrength(score);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = 'Valid email required';
    if (!formData.templeId.trim()) newErrors.templeId = 'Temple ID is required';
    if (!formData.templeCity.trim()) newErrors.templeCity = 'Temple city is required';
    if (!formData.adminCode.trim()) newErrors.adminCode = 'Admin verification code is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords must match';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'Accept terms & conditions';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      setErrors({ password: 'Password must meet all requirements' });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newVerificationCode = generateVerificationCode();
      const mockAdmin = {
        id: Date.now(),
        fullName: formData.fullName,
        email: formData.email,
        templeId: formData.templeId,
        templeCity: formData.templeCity,
        role: 'admin',
        verified: false,
        verificationCode: newVerificationCode
      };
      localStorage.setItem('adminData', JSON.stringify(mockAdmin));
      setVerificationCode(newVerificationCode);
      setSignupComplete(true);
    } catch (error) {
      setErrors({ submit: 'Admin signup failed. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToLogin = () => {
    navigate('/admin-signin');
  };

  const passwordRules = validatePassword(formData.password);

  if (signupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-gray-100">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
              <span className="text-3xl">✅</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-900 to-emerald-800 bg-clip-text text-transparent mb-2">
              Account Created!
            </h1>
            <p className="text-gray-600">Your admin account has been successfully created</p>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
            <h3 className="font-bold text-blue-900 mb-4">📋 Your Admin Details:</h3>
            <div className="space-y-3 text-sm">
              <p className="text-gray-800"><strong>Name:</strong> {formData.fullName}</p>
              <p className="text-gray-800"><strong>Email:</strong> {formData.email}</p>
              <p className="text-gray-800"><strong>Temple:</strong> {formData.templeCity} (ID: {formData.templeId})</p>
            </div>
          </div>

          <div className="bg-red-50 border-3 border-red-300 rounded-2xl p-8 mb-8">
            <h3 className="font-bold text-red-900 text-lg mb-2">🔐 Your Verification Code:</h3>
            <p className="text-gray-600 text-sm mb-4">Save this code - you'll need it to sign in:</p>
            <div className="bg-white border-2 border-red-300 rounded-xl p-6 text-center">
              <p className="text-4xl font-bold text-red-600 tracking-widest font-mono">{verificationCode}</p>
            </div>
            <p className="text-xs text-red-700 mt-4">⚠️ <strong>Important:</strong> Keep this code safe. You will need to enter it every time you sign in.</p>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(verificationCode);
              alert('Verification code copied to clipboard!');
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all mb-4"
          >
            📋 Copy Verification Code
          </button>

          <button
            onClick={handleContinueToLogin}
            className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all"
          >
            Continue to Sign In →
          </button>

          <div className="mt-8 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-2xl text-xs text-center">
            <p className="font-semibold text-yellow-800 mb-1">💡 Next Step:</p>
            <p className="text-yellow-700">Click "Continue to Sign In" to log in with your email, password, and verification code</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-gray-100">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <span className="text-3xl">👨‍💼</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-900 to-orange-800 bg-clip-text text-transparent mb-2">
            Admin Registration
          </h1>
          <p className="text-gray-600">Create your admin account to manage temples</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <div className="relative">
              <input
                type="text"
                name="fullName"
                placeholder="Your Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={loading}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm ${
                  errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              <div className="absolute left-4 top-5 text-gray-400">👤</div>
            </div>
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={loading}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              <div className="absolute left-4 top-5 text-gray-400">📧</div>
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Temple ID</label>
              <div className="relative">
                <input
                  type="text"
                  name="templeId"
                  placeholder="T001"
                  value={formData.templeId}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm ${
                    errors.templeId ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                <div className="absolute left-4 top-5 text-gray-400">🏛️</div>
              </div>
              {errors.templeId && <p className="text-red-500 text-sm mt-1">{errors.templeId}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Temple City</label>
              <div className="relative">
                <input
                  type="text"
                  name="templeCity"
                  placeholder="City Name"
                  value={formData.templeCity}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm ${
                    errors.templeCity ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                />
                <div className="absolute left-4 top-5 text-gray-400">📍</div>
              </div>
              {errors.templeCity && <p className="text-red-500 text-sm mt-1">{errors.templeCity}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Verification Code</label>
            <div className="relative">
              <input
                type="text"
                name="adminCode"
                placeholder="Enter your admin code"
                value={formData.adminCode}
                onChange={handleInputChange}
                disabled={loading}
                className={`w-full pl-12 pr-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm ${
                  errors.adminCode ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              <div className="absolute left-4 top-5 text-gray-400">🔑</div>
            </div>
            {errors.adminCode && <p className="text-red-500 text-sm mt-1">{errors.adminCode}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                disabled={loading}
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              <div className="absolute left-4 top-5 text-gray-400">🔒</div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
                className="absolute right-4 top-5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

            {formData.password && (
              <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-3">Password Requirements:</p>
                <div className="space-y-2">
                  <div className={`flex items-center text-sm ${passwordRules.rules.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className={`w-4 h-4 rounded-full mr-2 ${passwordRules.rules.minLength ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    At least 8 characters
                  </div>
                  <div className={`flex items-center text-sm ${passwordRules.rules.hasUpper ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className={`w-4 h-4 rounded-full mr-2 ${passwordRules.rules.hasUpper ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    One uppercase letter
                  </div>
                  <div className={`flex items-center text-sm ${passwordRules.rules.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className={`w-4 h-4 rounded-full mr-2 ${passwordRules.rules.hasNumber ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    One number
                  </div>
                  <div className={`flex items-center text-sm ${passwordRules.rules.hasSpecial ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className={`w-4 h-4 rounded-full mr-2 ${passwordRules.rules.hasSpecial ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    One special character
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={loading}
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all shadow-sm ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              />
              <div className="absolute left-4 top-5 text-gray-400">🔒</div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
                className="absolute right-4 top-5 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                disabled={loading}
                className="w-5 h-5 text-red-500 rounded border-gray-300 focus:ring-red-500"
              />
              <span className="ml-3 text-sm text-gray-700">
                I agree to the <span className="font-semibold text-red-600">Terms & Conditions</span>
              </span>
            </label>
            {errors.termsAccepted && <p className="text-red-500 text-sm mt-1">{errors.termsAccepted}</p>}
          </div>

          {errors.submit && (
            <div className="bg-red-50 border-2 border-red-200 text-red-800 px-4 py-3 rounded-2xl text-sm">
              {errors.submit}
            </div>
          )}

          <button
            type="submit"
            disabled={!formData.email || !formData.password || loading}
            className="w-full bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-xl"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              'Create Admin Account'
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/90 text-gray-500">OR</s