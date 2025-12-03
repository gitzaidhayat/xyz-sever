import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMail, FiLock } from 'react-icons/fi';
import { login, adminLogin } from '../../store/slices/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  const [role, setRole] = useState('user'); // 'user' or 'admin'
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Use adminLogin or login based on selected role
    const loginAction = role === 'admin' ? adminLogin : login;
    
    const result = await dispatch(loginAction({
      identifier: formData.identifier,
      password: formData.password,
    }));
    
    console.log('Login Result:', result);
    
    // Navigate based on role
    if (result.type.includes('fulfilled')) {
      console.log('Login successful, navigating...');
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f5e9da] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          
          <h1 className="text-3xl font-bold text-[#1f2933] mb-2 font-['Playfair_Display']">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Role Toggle */}
        <div className="mb-6 w-70 h-15 mx-auto">
          <div className="bg-white rounded-full p-1 shadow-md inline-flex w-full h-12 relative">
            {/* Animated Background Slider */}
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#02333a] rounded-full shadow-md transition-all duration-300 ease-in-out"
              style={{
                left: role === 'user' ? '4px' : 'calc(50% + 0px)',
              }}
            />
            <button
              type="button"
              onClick={() => setRole('user')}
              className={`flex-1 py-2 px-5 rounded-full font-medium transition-all duration-300 ease-in-out z-10 ${
                role === 'user'
                  ? 'text-white scale-105'
                  : 'text-gray-600 hover:text-[#1f2933]'
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/login')}
              className={`flex-1 py-2 px-5 rounded-full font-medium transition-all duration-300 ease-in-out z-10 ${
                role === 'admin'
                  ? 'text-white scale-105'
                  : 'text-gray-600 hover:text-[#1f2933]'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label="Email or Username"
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter your email or username"
              icon={<FiMail />}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={<FiLock />}
              required
            />

            <div className="flex  items-center justify-end text-sm">
              
              <Link to="/forgot-password" className="text-[#d5a437] hover:text-[#e0b54d]">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-[#d5a437] hover:text-[#e0b54d] font-medium">
                Create one
              </Link>
            </p>
          </div>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-600 hover:text-[#1f2933] text-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
