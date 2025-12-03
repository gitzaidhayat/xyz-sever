import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import AuthRoleToggle from '../../components/auth/AuthRoleToggle';
import { adminRegister } from '../../store/slices/authSlice';

const AdminRegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const [formErrors, setFormErrors] = useState({});

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

    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      const { confirmPassword, ...registerData } = formData;
      await dispatch(adminRegister(registerData)).unwrap();
      navigate('/admin');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5e9da] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1f2933] mb-2 font-['Playfair_Display']">
            Become an Admin
          </h1>
          <p className="text-gray-600">Join our wholesale network</p>
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
              onClick={() => navigate('/register')}
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

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Information */}
            <div>
              <h2 className="text-xl font-semibold text-[#1f2933] mb-4">Business Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="ABC Textiles"
                  required
                />

                <Input
                  label="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe123"
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-[#1f2933] mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Input
                  label="Phone Number"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1234567890"
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="business@email.com"
                  error={formErrors.email}
                  required
                />
              </div>
            </div>

            

            {/* Password */}
            <div>
              <h2 className="text-xl font-semibold text-[#1f2933] mb-4">Security</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
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
                  error={formErrors.confirmPassword}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Partner Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have a partner account?{' '}
              <Link
                to="/admin/login"
                className="text-[#d5a437] hover:text-[#e0b54d] font-medium"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-[#d5a437]"
            >
              ← Register as a customer instead
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

export default AdminRegisterPage;
