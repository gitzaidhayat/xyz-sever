import { useEffect, useState } from 'react';
import { adminApi } from '../../api/adminApi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';
import { FiUser, FiMail, FiPhone, FiEdit2, FiX, FiSave, FiSearch, FiTrash2 } from 'react-icons/fi';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    role: 'user',
    isVerified: false
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (search = '') => {
    setIsLoading(true);
    try {
      const data = await adminApi.getAllUsers({ search });
      setUsers(data.users || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(searchTerm);
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'user',
      isVerified: user.isVerified || false
    });
    setIsEditing(false);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await adminApi.updateUser(selectedUser._id, formData);
      alert('User updated successfully!');
      setIsEditing(false);
      fetchUsers(searchTerm);
      // Update selected user
      const updated = await adminApi.getUserById(selectedUser._id);
      setSelectedUser(updated.user);
    } catch (error) {
      alert('Failed to update user: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    if (window.confirm(`Are you sure you want to ${currentStatus ? 'deactivate' : 'activate'} this user?`)) {
      try {
        await adminApi.updateUserStatus(id, !currentStatus);
        fetchUsers(searchTerm);
        if (selectedUser && selectedUser._id === id) {
          setSelectedUser(null);
        }
      } catch (error) {
        alert('Failed to update status');
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminApi.deleteUser(id);
        alert('User deleted successfully');
        fetchUsers(searchTerm);
        if (selectedUser && selectedUser._id === id) {
          setSelectedUser(null);
        }
      } catch (error) {
        alert('Failed to delete user');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
            <p className="text-gray-500 mt-1">View and manage customer accounts</p>
          </div>
        </div>

        <div className="p-8">
          {/* Search Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Search
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    fetchUsers('');
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              )}
            </form>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Users List */}
            <div className="lg:col-span-2">
              {isLoading ? (
                <Loader fullScreen={false} />
              ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {users.length === 0 ? (
                    <div className="p-12 text-center">
                      <p className="text-gray-500 text-lg">No users found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr 
                              key={user._id} 
                              className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                                selectedUser?._id === user._id ? 'bg-orange-50' : ''
                              }`}
                              onClick={() => handleViewProfile(user)}
                            >
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                                    <FiUser className="text-orange-600" size={20} />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-800">{user.fullName}</p>
                                    {user.phone && (
                                      <p className="text-xs text-gray-500">{user.phone}</p>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  user.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {user.isVerified ? 'Verified' : 'Unverified'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteUser(user._id);
                                  }}
                                  className="text-red-500 hover:text-red-700 transition-colors"
                                >
                                  <FiTrash2 size={18} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile Panel */}
            <div className="lg:col-span-1">
              {selectedUser ? (
                <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">User Profile</h2>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FiX size={20} />
                    </button>
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleUpdateUser} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FiUser className="inline mr-2" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FiMail className="inline mr-2" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <FiPhone className="inline mr-2" />
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isVerified"
                          checked={formData.isVerified}
                          onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
                          className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                        />
                        <label htmlFor="isVerified" className="text-sm font-medium text-gray-700">
                          Verified Account
                        </label>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          <FiSave size={18} />
                          Save
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center pb-4 border-b border-gray-200">
                        <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                          <FiUser className="text-orange-600" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-800">{selectedUser.fullName}</h3>
                        <p className="text-sm text-gray-500">{selectedUser.email}</p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 uppercase mb-1">Phone</p>
                          <p className="text-sm text-gray-800">{selectedUser.phone || 'Not provided'}</p>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 uppercase mb-1">Role</p>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {selectedUser.role}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 uppercase mb-1">Status</p>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            selectedUser.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedUser.isVerified ? 'Verified' : 'Unverified'}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs text-gray-500 uppercase mb-1">Member Since</p>
                          <p className="text-sm text-gray-800">
                            {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 space-y-2">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          <FiEdit2 size={18} />
                          Edit Profile
                        </button>
                        <button
                          onClick={() => handleToggleStatus(selectedUser._id, selectedUser.isVerified)}
                          className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          {selectedUser.isVerified ? 'Mark as Unverified' : 'Mark as Verified'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <FiUser className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500">Select a user to view profile</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
