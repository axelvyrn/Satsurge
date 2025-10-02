import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, User, Gamepad2, ArrowLeft, Mail, Lock, UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'player' | 'creator' | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register, user: currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate(currentUser.type === 'creator' ? '/creator' : '/player');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        if (!userType) {
          setError('Please select account type');
          setLoading(false);
          return;
        }
        success = await register(formData.email, formData.password, formData.username, userType);
      }

      if (!success) {
        setError(isLogin ? 'Invalid credentials' : 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <Link to="/" className="flex items-center text-orange-600 hover:text-orange-700 mb-8">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Zap className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                Satsurge
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin ? 'Sign in to your account' : 'Join the Lightning gaming revolution'}
            </p>
          </div>

          {/* User Type Selection (Registration only) */}
          {!isLogin && !userType && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose your path:</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setUserType('player')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-orange-300 transition-colors text-center group"
                >
                  <User className="h-8 w-8 text-orange-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-gray-900 mb-2">Player</h4>
                  <p className="text-sm text-gray-600">Compete in tournaments and win sats</p>
                </button>

                <button
                  onClick={() => setUserType('creator')}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-orange-300 transition-colors text-center group"
                >
                  <Gamepad2 className="h-8 w-8 text-orange-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h4 className="font-semibold text-gray-900 mb-2">Creator</h4>
                  <p className="text-sm text-gray-600">Build games and earn revenue</p>
                </button>
              </div>
            </div>
          )}

          {/* Auth Form */}
          {(isLogin || userType) && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </button>
            </form>
          )}

          {/* Toggle Auth Mode */}
          {(isLogin || userType) && (
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setUserType(null);
                    setError('');
                    setFormData({ email: '', password: '', username: '' });
                  }}
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          )}

          {/* Back Button for User Type Selection */}
          {!isLogin && userType && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setUserType(null)}
                className="text-gray-600 hover:text-gray-700 text-sm flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Choose different account type
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}