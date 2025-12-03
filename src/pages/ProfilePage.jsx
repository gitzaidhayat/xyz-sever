import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiShoppingBag, FiPlus } from 'react-icons/fi';
import { MdOutlinePayment } from "react-icons/md";
import { updateProfile, changePassword, logout } from '../store/slices/authSlice';
import { fetchAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from '../store/slices/addressSlice';
import AddressModal from '../components/address/AddressModal';
import AddressCard from '../components/address/AddressCard';


const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);
  const { addresses, isLoading: addressLoading } = useSelector((state) => state.addresses);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    // Fetch addresses when component mounts
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/', { replace: true });
  };

  const [activeSection, setActiveSection] = useState('personal-info');
  const [isEditing, setIsEditing] = useState(false);
  
  // Profile form
  const [profileData, setProfileData] = useState({
    firstName: user?.fullName?.split(' ')[0] || '',
    lastName: user?.fullName?.split(' ').slice(1).join(' ') || '',
    gender: user?.gender || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Password form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile({
        fullName: `${profileData.firstName} ${profileData.lastName}`,
        email: profileData.email,
        phone: profileData.phone,
        gender: profileData.gender,
      })).unwrap();
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      alert(error || 'Failed to update profile');
    }
  };

  const sidebarMenu = [
    {
      title: 'MY ORDERS',
      icon: FiShoppingBag,
      section: 'orders',
    },
    {
      title: 'ACCOUNT SETTINGS',
      items: [
        { name: 'Profile Information', section: 'personal-info' },
        { name: 'Manage Addresses', section: 'addresses' },
        { name: 'Change Password', section: 'password' },
      ],
    },
    {
      title: 'PAYMENTS',
      icon: MdOutlinePayment,
      items: [
        { name: 'Gift Cards', section: 'gift-cards', badge: '₹0' },
        { name: 'Saved Cards', section: 'saved-cards' },
      ],
    },
    {
      title: 'MY STUFF',
      items: [
        { name: 'My Coupons', section: 'coupons' },
        { name: 'All Notifications', section: 'notifications' },
        { name: 'My Wishlist', section: 'wishlist' },
      ],
    },
  ];

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      await dispatch(changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })).unwrap();
      
      alert('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      alert(error || 'Failed to change password');
    }
  };

  // Address handlers
  const handleAddAddress = () => {
    setSelectedAddress(null);
    setIsAddressModalOpen(true);
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (addressData) => {
    try {
      if (selectedAddress) {
        await dispatch(updateAddress({ addressId: selectedAddress._id, addressData })).unwrap();
        alert('Address updated successfully!');
      } else {
        await dispatch(addAddress(addressData)).unwrap();
        alert('Address added successfully!');
      }
      setIsAddressModalOpen(false);
      setSelectedAddress(null);
    } catch (error) {
      alert(error || 'Failed to save address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await dispatch(deleteAddress(addressId)).unwrap();
        alert('Address deleted successfully!');
      } catch (error) {
        alert(error || 'Failed to delete address');
      }
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    try {
      await dispatch(setDefaultAddress(addressId)).unwrap();
      alert('Default address updated!');
    } catch (error) {
      alert(error || 'Failed to set default address');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 shrink-0">
            {/* User Profile Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-[#d5a437] to-[#e0b54d] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hello Mr.</p>
                  <p className="pl-2 font-medium! text-[#1f2933]">{user?.fullName || 'User'}</p>
                </div>
              </div>
            </div>

            {/* Menu */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {sidebarMenu.map((menu, idx) => (
                <div key={idx} className="border-b border-gray-100 last:border-b-0">
                  {menu.section ? (
                    <button
                      onClick={() => setActiveSection(menu.section)}
                      className={`w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-left ${
                        activeSection === menu.section ? 'bg-blue-50 text-[#2874f0]' : ''
                      }`}
                    >
                      <menu.icon className="text-[#2874f0]" size={18} />
                      <span className="text-sm font-medium text-gray-900">{menu.title}</span>
                    </button>
                  ) : (
                    <div>
                      <div className="px-6 py-3 bg-gray-200 ">
                        <p className="text-[15px] font-bold text-gray-600">{menu.title}</p>
                      </div>
                      {menu.items?.map((item, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveSection(item.section)}
                          className={`w-full flex items-center justify-between px-6 py-3 hover:bg-blue-50 transition-colors text-left ${
                            activeSection === item.section ? 'bg-blue-50 text-[#2874f0] border-l-2 border-[#2874f0]' : 'text-gray-700'
                          }`}
                        >
                          <span className="text-sm">{item.name}</span>
                          {item.badge && (
                            <span className="text-xs font-medium text-green-600">{item.badge}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-6 py-4 hover:bg-red-50 transition-colors text-left border-t border-gray-100"
              >
                <FiLogOut className="text-red-600" size={18} />
                <span className="text-sm font-medium text-red-600">Logout</span>
              </button>
            </div>

            {/* Frequently Visited */}
            <div className="mt-4 px-4">
              <p className="text-xs text-gray-500 mb-2">Frequently Visited:</p>
              <div className="flex gap-2 text-xs text-gray-600">
                <button className="hover:text-[#2874f0]">Track Order</button>
                <span>•</span>
                <button className="hover:text-[#2874f0]">Help Center</button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Personal Information */}
            {activeSection === 'personal-info' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                  <h2 className="text-xl font-medium text-[#1f2933]">Personal Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-sm text-[#2874f0] hover:underline font-medium"
                    >
                      Edit
                    </button>
                  )}
                </div>
                
                <form onSubmit={handleProfileSubmit} className="p-8">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        placeholder="First Name"
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#2874f0] disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        placeholder="Last Name"
                        disabled={!isEditing}
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#2874f0] disabled:bg-gray-50 disabled:text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-3">Your Gender</p>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="male"
                          checked={profileData.gender === 'male'}
                          onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                          disabled={!isEditing}
                          className="text-[#2874f0] focus:ring-[#2874f0]"
                        />
                        <span className="text-sm text-gray-700">Male</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="gender"
                          value="female"
                          checked={profileData.gender === 'female'}
                          onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                          disabled={!isEditing}
                          className="text-[#2874f0] focus:ring-[#2874f0]"
                        />
                        <span className="text-sm text-gray-700">Female</span>
                      </label>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-2 bg-[#2874f0] text-white rounded hover:bg-[#1c5bbf] transition-colors disabled:opacity-50"
                      >
                        {isLoading ? 'Saving...' : 'SAVE'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-8 py-2 text-[#2874f0] font-medium hover:bg-blue-50 rounded transition-colors"
                      >
                        CANCEL
                      </button>
                    </div>
                  )}
                </form>

                {/* Email Address */}
                <div className="px-8 py-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-[#1f2933]">Email Address</h3>
                    <button className="text-sm text-[#2874f0] hover:underline font-medium">
                      Edit
                    </button>
                  </div>
                  <div className="bg-gray-50 px-4 py-2 rounded border border-gray-200 inline-block">
                    <p className="text-sm text-gray-700">{user?.email}</p>
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="px-8 py-6 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-[#1f2933]">Mobile Number</h3>
                    <button className="text-sm text-[#2874f0] hover:underline font-medium">
                      Edit
                    </button>
                  </div>
                  <div className="bg-gray-50 px-4 py-2 rounded border border-gray-200 inline-block">
                    <p className="text-sm text-gray-700">{user?.phone }</p>
                  </div>
                </div>

                {/* FAQs */}
                <div className="px-8 py-6 border-t border-gray-100">
                  <h3 className="text-lg font-medium text-[#1f2933] mb-4">FAQs</h3>
                  <div className="space-y-4 text-sm text-gray-700">
                    <div>
                      <p className="font-medium mb-1">What happens when I update my email address (or mobile number)?</p>
                      <p className="text-gray-600">Your login email id (or mobile number) changes, likewise. You'll receive all your account related communication on your updated email address (or mobile number).</p>
                    </div>
                    <div>
                      <p className="font-medium mb-1">When will my ABAYA account be updated with the new email address (or mobile number)?</p>
                      <p className="text-gray-600">It happens as soon as you confirm the verification code sent to your email (or mobile) and save the changes.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* My Orders Section */}
            {activeSection === 'my-orders' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-8 py-6 border-b border-gray-100">
                  <h2 className="text-xl font-medium text-[#1f2933]">My Orders</h2>
                </div>
                
                <div className="p-8">
                  <div className="text-center py-12">
                    <FiShoppingBag className="mx-auto text-gray-300 mb-4" size={64} />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No Orders Yet</h3>
                    <p className="text-gray-500 mb-6">You haven't placed any orders yet</p>
                    <button
                      onClick={() => navigate('/products')}
                      className="px-6 py-2 bg-[#2874f0] text-white rounded hover:bg-[#1c5bbf] transition-colors"
                    >
                      Start Shopping
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Manage Addresses Section */}
            {activeSection === 'addresses' && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                  <h2 className="text-xl font-medium text-[#1f2933]">Manage Addresses</h2>
                  <button
                    onClick={handleAddAddress}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2874f0] text-white rounded hover:bg-[#1c5bbf] transition-colors"
                  >
                    <FiPlus size={18} />
                    ADD NEW ADDRESS
                  </button>
                </div>

                <div className="p-8">
                  {addressLoading ? (
                    <p className="text-center text-gray-600 py-8">Loading addresses...</p>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-4">No addresses added yet</p>
                      <button
                        onClick={handleAddAddress}
                        className="px-6 py-2 bg-[#2874f0] text-white rounded hover:bg-[#1c5bbf] transition-colors"
                      >
                        Add Your First Address
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <AddressCard
                          key={address._id}
                          address={address}
                          onEdit={handleEditAddress}
                          onDelete={handleDeleteAddress}
                          onSetDefault={handleSetDefaultAddress}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Other Sections Placeholder */}
            {activeSection !== 'personal-info' && activeSection !== 'my-orders' && activeSection !== 'addresses' && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-xl font-medium text-[#1f2933] mb-4">
                  {sidebarMenu.flatMap(m => m.items || []).find(i => i.section === activeSection)?.name || 
                   sidebarMenu.find(m => m.section === activeSection)?.title}
                </h2>
                <p className="text-gray-600">This section is under development.</p>
              </div>
            )}

            {/* Address Modal */}
            <AddressModal
              isOpen={isAddressModalOpen}
              onClose={() => {
                setIsAddressModalOpen(false);
                setSelectedAddress(null);
              }}
              onSave={handleSaveAddress}
              address={selectedAddress}
              isLoading={addressLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
