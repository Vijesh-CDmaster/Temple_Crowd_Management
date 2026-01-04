import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [strength, setStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Password rules checker
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
      
      const mockUser = {
        id: Date.now(),
        fullName: formData.fullName,
        email: formData.email,
        verified: false
      };
      
      const mockToken = 'mock-jwt-' + Date.now();
      
      login(mockUser, mockToken);
      localStorage.setItem('bookedTickets', JSON.stringify([]));
      
      navigate('/temples');
    } catch (error) {
      setErrors({ submit: 'Signup failed. Try again.' });
    } finally {
      setLoading(false);
    }
  };

  const passwordRules = validatePassword(formData.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-temple-beige to-white flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-temple-gold to-amber-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <span className="text-3xl">🙏</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-temple-dark bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-gray-600">Join thousands of devotees</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all ${
                errors.fullName ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all ${
                errors.email ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter strong password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              <div className="absolute left-4 top-5 text-gray-400">🔒</div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>

            {/* ✅ PASSWORD RULES CHECKLIST */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center text-xs">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 text-white font-bold text-xs ${
                  passwordRules.minLength ? 'bg-emerald-500' : 'bg-gray-300'
                }`}>
                  {passwordRules.minLength ? '✓' : '✗'}
                </div>
                <span className={passwordRules.minLength ? 'text-emerald-600' : 'text-gray-500'}>
                  Minimum 8 characters
                </span>
              </div>
              
              <div className="flex items-center text-xs">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 text-white font-bold text-xs ${
                  passwordRules.hasUpper ? 'bg-emerald-500' : 'bg-gray-300'
                }`}>
                  {passwordRules.hasUpper ? '✓' : '✗'}
                </div>
                <span className={passwordRules.hasUpper ? 'text-emerald-600' : 'text-gray-500'}>
                  1 Uppercase letter (A-Z)
                </span>
              </div>
              
              <div className="flex items-center text-xs">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 text-white font-bold text-xs ${
                  passwordRules.hasNumber ? 'bg-emerald-500' : 'bg-gray-300'
                }`}>
                  {passwordRules.hasNumber ? '✓' : '✗'}
                </div>
                <span className={passwordRules.hasNumber ? 'text-emerald-600' : 'text-gray-500'}>
                  1 Number (0-9)
                </span>
              </div>
              
              <div className="flex items-center text-xs">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 text-white font-bold text-xs ${
                  passwordRules.hasSpecial ? 'bg-emerald-500' : 'bg-gray-300'
                }`}>
                  {passwordRules.hasSpecial ? '✓' : '✗'}
                </div>
                <span className={passwordRules.hasSpecial ? 'text-emerald-600' : 'text-gray-500'}>
                  1 Special character (!@#$%^&*)
                </span>
              </div>
            </div>

            {/* ✅ DEMO PASSWORD EXAMPLE */}
            <div className="mt-4 p-3 bg-blue-50 border-2 border-blue-200 rounded-xl">
              <p className="font-semibold text-blue-800 text-sm mb-1">💡 Demo Password:</p>
              <p className="text-blue-700 text-sm font-mono bg-white px-2 py-1 rounded text-xs">
                Devotee@123
              </p>
              <p className="text-xs text-blue-600 mt-1">Copy this format: Uppercase + Number + Special</p>
            </div>

            {errors.password && <p className="text-red-500 text-sm mt-2">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full pl-12 pr-12 py-4 border-2 rounded-2xl focus:ring-2 focus:ring-temple-gold focus:border-transparent transition-all ${
                  errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200'
                }`}
              />
              <div className="absolute left-4 top-5 text-gray-400">🔒</div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-5 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all"
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Terms */}
          <div className="flex items-start">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleInputChange}
              className="w-5 h-5 mt-1 text-temple-gold rounded focus:ring-temple-gold"
            />
            <label className="ml-3 text-sm text-gray-700 leading-relaxed cursor-pointer flex-1">
              I accept{' '}
              <Link href="#" className="text-temple-gold hover:underline font-semibold">Terms & Conditions</Link>{' '}
              and{' '}
              <Link href="#" className="text-temple-gold hover:underline font-semibold">Privacy Policy</Link>
            </label>
          </div>
          {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted}</p>}

          {errors.submit && <p className="text-red-500 text-center text-sm p-3 bg-red-50 rounded-2xl">{errors.submit}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || strength !== 4 || !formData.termsAccepted}
            className="w-full bg-gradient-to-r from-temple-gold to-amber-600 hover:from-temple-gold/90 text-white font-bold py-4 px-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-xl"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="font-bold text-temple-gold hover:underline">
              Sign In →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
