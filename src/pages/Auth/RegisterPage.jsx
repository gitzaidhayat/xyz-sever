import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';
import { register } from '../../store/slices/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: location.state?.email || '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const { confirmPassword, name, ...rest } = formData;
    const userData = {
      fullName: name,
      ...rest
    };
    dispatch(register(userData));
  };

  return (
    <div className="min-h-screen bg-[#f5e9da] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-[#d5a437] flex items-center justify-center">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            <span className="text-3xl font-bold text-[#1f2933] font-['Playfair_Display']">
              ABAYA
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[#1f2933] mb-2 font-['Playfair_Display']">
            Create Account
          </h1>
          <p className="text-gray-600">Join us to start your wholesale journey</p>
        </div>


        {/* Role Toggle */}
        <div className="mb-6 w-70 h-15 mx-auto">
          <div className="bg-white rounded-full p-1 shadow-md inline-flex w-full h-12 relative">
            {/* Animated Background Slider */}
            <div
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#02333a] rounded-full shadow-md transition-all duration-300 ease-in-out"
              style={{ left: '4px' }}
            />
            <button
              type="button"
              className="flex-1 py-2 px-5 rounded-full font-medium transition-all duration-300 ease-in-out z-10 text-white scale-105"
            >
              User
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/register')}
              className="flex-1 py-2 px-5 rounded-full font-medium transition-all duration-300 ease-in-out z-10 text-gray-600 hover:text-[#1f2933]"
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
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              icon={<FiUser />}
              error={formErrors.name}
              required
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              icon={<FiMail />}
              error={formErrors.email}
              required
            />

            <Input
              label="Phone (Optional)"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
              icon={<FiPhone />}
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={<FiLock />}
              error={formErrors.password}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              icon={<FiLock />}
              error={formErrors.confirmPassword}
              required
            />

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 text-[#d5a437] border-gray-300 rounded focus:ring-[#d5a437]"
              />
              <label className="text-sm text-gray-700">
                I agree to the{' '}
                <Link to="/terms" className="text-[#d5a437] hover:text-[#e0b54d]">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-[#d5a437] hover:text-[#e0b54d]">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-[#d5a437] hover:text-[#e0b54d] font-medium">
                Sign in
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

export default RegisterPage;
