import { useState, useEffect } from 'react';
import { FiX, FiMapPin } from 'react-icons/fi';

const AddressModal = ({ isOpen, onClose, onSave, address, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    zipCode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    landmark: '',
    alternatePhone: '',
    addressType: 'home',
  });

  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  useEffect(() => {
    if (address) {
      setFormData({
        name: address.fullName || '',
        phone: address.phone || '',
        zipCode: address.zipCode || '',
        locality: address.locality || '',
        address: address.address || '',
        city: address.city || '',
        state: address.state || '',
        landmark: address.landmark || '',
        alternatePhone: address.alternatePhone || '',
        addressType: address.addressType || 'home',
      });
    } else {
      setFormData({
        name: '',
        phone: '',
        zipCode: '',
        locality: '',
        address: '',
        city: '',
        state: '',
        landmark: '',
        alternatePhone: '',
        addressType: 'home',
      });
    }
  }, [address]);

  const fetchPincodeDetails = async (pincode) => {
    if (pincode.length !== 6) return;

    setPincodeLoading(true);
    setPincodeError('');

    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await response.json();

      if (data && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
        const postOffice = data[0].PostOffice[0];
        setFormData((prev) => ({
          ...prev,
          city: postOffice.District || prev.city,
          state: postOffice.State || prev.state,
        }));
        setPincodeError('');
      } else {
        setPincodeError('Invalid pincode or details not found');
        setFormData((prev) => ({
          ...prev,
          city: '',
          state: '',
        }));
      }
    } catch (error) {
      console.error('Error fetching pincode details:', error);
      setPincodeError('Failed to fetch pincode details');
    } finally {
      setPincodeLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Only allow numbers for phone fields
    if ((name === 'phone' || name === 'alternatePhone') && value && !/^\d*$/.test(value)) {
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-fetch city and state when pincode is complete
    if (name === 'zipCode' && value.length === 6 && /^\d{6}$/.test(value)) {
      fetchPincodeDetails(value);
    } else if (name === 'zipCode' && value.length < 6) {
      setPincodeError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Map form data back to expected format
    const addressData = {
      fullName: formData.name,
      phone: formData.phone,
      zipCode: formData.zipCode,
      locality: formData.locality,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      country: 'India',
      landmark: formData.landmark,
      alternatePhone: formData.alternatePhone,
      addressType: formData.addressType,
      isDefault: false,
    };
    onSave(addressData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#2874f0] text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">
            {address ? 'EDIT ADDRESS' : 'ADD A NEW ADDRESS'}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">

          {/* Name and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#2874f0]"
              />
            </div>
            <div>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                required
                maxLength={10}
                pattern="[0-9]{10}"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#2874f0]"
              />
            </div>
          </div>

          {/* Address */}
          <div className="mb-4">
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address (Area and Street)"
              required
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#2874f0] resize-none"
            />
          </div>


          {/* Pincode and Locality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="relative">
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  required
                  maxLength={6}
                  pattern="[0-9]{6}"
                  className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#2874f0]"
                />
                {pincodeLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-[#2874f0] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              {pincodeError && (
                <p className="text-red-500 text-xs mt-1">{pincodeError}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="locality"
                value={formData.locality}
                onChange={handleChange}
                placeholder="Locality"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#2874f0]"
              />
            </div>
          </div>

          

          {/* City and State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#2874f0] bg-white disabled:bg-gray-100"
                disabled={pincodeLoading}
              >
                <option value="">--Select State--</option>
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Assam">Assam</option>
                <option value="Bihar">Bihar</option>
                <option value="Chhattisgarh">Chhattisgarh</option>
                <option value="Delhi">Delhi</option>
                <option value="Goa">Goa</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Haryana">Haryana</option>
                <option value="Himachal Pradesh">Himachal Pradesh</option>
                <option value="Jharkhand">Jharkhand</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Kerala">Kerala</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Manipur">Manipur</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Odisha">Odisha</option>
                <option value="Punjab">Punjab</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Telangana">Telangana</option>
                <option value="Tripura">Tripura</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Uttarakhand">Uttarakhand</option>
                <option value="West Bengal">West Bengal</option>
              </select>
            </div>
            <div>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City/District/Town"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#2874f0] disabled:bg-gray-100"
                disabled={pincodeLoading}
              />
            </div>
          </div>

          {/* Landmark and Alternate Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="Landmark (Optional)"
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#2874f0]"
              />
            </div>
            <div>
              <input
                type="tel"
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleChange}
                placeholder="Alternate Phone (Optional)"
                maxLength={10}
                className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:border-[#2874f0]"
              />
            </div>
          </div>

          {/* Address Type */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-2">Address Type</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="addressType"
                  value="home"
                  checked={formData.addressType === 'home'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#2874f0] focus:ring-[#2874f0]"
                />
                <span className="text-sm text-gray-800">Home</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="addressType"
                  value="work"
                  checked={formData.addressType === 'work'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#2874f0] focus:ring-[#2874f0]"
                />
                <span className="text-sm text-gray-800">Work</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-12 py-3 bg-[#2874f0] text-white font-medium rounded hover:bg-[#1c5bbf] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'SAVING...' : 'SAVE'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-12 py-3 text-[#2874f0] font-medium hover:bg-blue-50 rounded transition-colors"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
