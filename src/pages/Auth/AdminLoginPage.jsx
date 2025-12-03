import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import AuthRoleToggle from '../../components/auth/AuthRoleToggle';
import { adminLogin } from '../../store/slices/authSlice';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Admin login attempt with:', formData.identifier);
    try {
      const result = await dispatch(adminLogin({ 
        identifier: formData.identifier, 
        password: formData.password 
      })).unwrap();
      console.log('Admin login successful:', result);
      navigate('/admin', { replace: true });
    } catch (err) {
      console.error('Admin login failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5e9da] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1f2933] mb-2 font-['Playfair_Display']">
            Admin Login
          </h1>
          <p className="text-gray-600">Sign in to manage your inventory</p>
        </div>

        {/* Role Toggle */}
        <div className="mb-6 w-70 h-15 mx-auto">
          <div className="bg-white rounded-full p-1 shadow-md inline-flex w-full h-12 relative">
            {/* Animated Background Slider */}
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#02333a] rounded-full shadow-md transition-all duration-300 ease-in-out"
              style={{ left: 'calc(50% + 0px)' }}
            />
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="flex-1 py-2 px-5 rounded-full font-medium transition-all duration-300 ease-in-out z-10 text-gray-600 hover:text-[#1f2933]"
            >
              User
            </button>
            <button
              type="button"
              className="flex-1 py-2 px-5 rounded-full font-medium transition-all duration-300 ease-in-out z-10 text-white scale-105"
            >
              Admin
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email or Username"
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="email@example.com or username"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#d5a437] border-gray-300 rounded focus:ring-[#d5a437]"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm text-[#d5a437] hover:text-[#e0b54d]"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have a partner account?{' '}
              <Link
                to="/admin/register"
                className="text-[#d5a437] hover:text-[#e0b54d] font-medium"
              >
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-[#d5a437]"
            >
              ← Back to customer login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-gray-600 hover:text-[#d5a437] transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
