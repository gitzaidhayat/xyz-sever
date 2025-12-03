import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { authApi } from '../../api/authApi';
import { adminLogout } from '../../store/slices/authSlice';
import { FiUser, FiMail, FiPhone, FiShield, FiLogOut, FiShoppingBag, FiPackage, FiUsers, FiGift } from 'react-icons/fi';

export default function AdminProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [activeSection, setActiveSection] = useState('personal-info');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.fullName?.split(' ')[0] || '',
    lastName: user?.fullName?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    username: user?.username || '',
  });

  const handleLogout = async () => {
    await dispatch(adminLogout());
    navigate('/', { replace: true });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // API call to update admin profile
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      alert(error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const sidebarMenu = [
    {
      title: 'DASHBOARD',
      icon: FiShoppingBag,
      section: 'dashboard',
      onClick: () => navigate('/admin'),
    },
    {
      title: 'ACCOUNT SETTINGS',
      items: [
        { name: 'Profile Information', section: 'personal-info' },
        { name: 'Change Password', section: 'password' },
      ],
    },
    {
      title: 'MANAGEMENT',
      items: [
        { name: 'Products', section: 'products' },
        { name: 'Orders', section: 'orders' },
        { name: 'Users', section: 'users' },
        { name: 'Coupons', section: 'coupons' }
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 shrink-0">
            {/* Admin Profile Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-[#d5a437] to-[#e0b54d] rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Admin</p>
                  <p className="font-semibold text-[#1f2933]">{user?.fullName || 'Administrator'}</p>
                </div>
              </div>
            </div>

            {/* Menu */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {sidebarMenu.map((menu, idx) => (
                <div key={idx} className="border-b border-gray-100 last:border-b-0">
                  {menu.onClick ? (
                    <button
                      onClick={menu.onClick}
                      className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <menu.icon className="text-[#2874f0]" size={18} />
                      <span className="text-sm font-medium text-gray-700">{menu.title}</span>
                    </button>
                  ) : (
                    <div>
                      <div className="px-6 py-3 bg-gray-50">
                        <p className="text-xs font-semibold text-gray-600">{menu.title}</p>
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

                  <div className="mb-6">
                    <input
                      type="text"
                      value={profileData.username}
                      onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                      placeholder="Username"
                      disabled={!isEditing}
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-[#2874f0] disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>

                  {isEditing && (
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2 bg-[#2874f0] text-white rounded hover:bg-[#1c5bbf] transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'SAVE'}
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
                    <p className="text-sm text-gray-700">{user?.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Other Sections Placeholder */}
            {activeSection !== 'personal-info' && (
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-xl font-medium text-[#1f2933] mb-4">
                  {sidebarMenu.flatMap(m => m.items || []).find(i => i.section === activeSection)?.name ||
                   sidebarMenu.find(m => m.section === activeSection)?.title}
                </h2>
                <p className="text-gray-600">This section is under development.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
