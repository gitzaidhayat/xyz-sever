import { useState } from 'react';
import { FiStar } from 'react-icons/fi';

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    rating: 0,
    category: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      setStatus({ type: 'error', message: 'Please select a rating.' });
      return;
    }

    setLoading(true);
    setStatus(null);

    // Simulate form submission
    setTimeout(() => {
      setStatus({ 
        type: 'success', 
        message: 'Thank you for your feedback! We appreciate your input and will use it to improve our services.' 
      });
      setFormData({
        name: '',
        email: '',
        orderNumber: '',
        rating: 0,
        category: '',
        message: ''
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">We Value Your Feedback</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your opinion matters to us. Help us serve you better by sharing your experience.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Email */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            {/* Order Number */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Order Number (Optional)
              </label>
              <input
                type="text"
                name="orderNumber"
                value={formData.orderNumber}
                onChange={handleChange}
                placeholder="Enter your order number if applicable"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-gray-700 font-medium mb-3">
                Overall Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <FiStar
                      size={32}
                      className={`${
                        star <= formData.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {formData.rating > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {formData.rating === 1 && 'Poor'}
                  {formData.rating === 2 && 'Fair'}
                  {formData.rating === 3 && 'Good'}
                  {formData.rating === 4 && 'Very Good'}
                  {formData.rating === 5 && 'Excellent'}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Feedback Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-teal-500 bg-white"
              >
                <option value="">Select a category</option>
                <option value="product-quality">Product Quality</option>
                <option value="customer-service">Customer Service</option>
                <option value="delivery">Delivery Experience</option>
                <option value="website">Website Experience</option>
                <option value="pricing">Pricing</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Your Feedback <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Please share your thoughts, suggestions, or concerns..."
                required
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-teal-500 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-teal-500 text-white font-medium rounded hover:bg-teal-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>

            {/* Status Message */}
            {status && (
              <div className={`p-4 rounded ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {status.message}
              </div>
            )}
          </form>
        </div>

        {/* Why Feedback Matters */}
        <div className="mt-12 bg-linear-to-r from-teal-500 to-teal-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Why Your Feedback Matters</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Improve Quality</h3>
              <p className="text-sm opacity-90">
                Your insights help us enhance our product quality and service standards.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Better Experience</h3>
              <p className="text-sm opacity-90">
                We use your feedback to create a better shopping experience for everyone.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Customer First</h3>
              <p className="text-sm opacity-90">
                Every piece of feedback is reviewed and valued by our team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
