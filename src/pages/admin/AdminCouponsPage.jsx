import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { adminApi } from '../../api/adminApi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';

const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    expiresAt: '',
  });
  const [codeError, setCodeError] = useState('');

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const data = await adminApi.getAllCoupons();
      setCoupons(data.coupons || data);
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate coupon code minimum length 8
    const code = (formData.code || '').trim();
    if (code.length < 8) {
      setCodeError('Coupon code must be at least 8 characters');
      return;
    }
    setCodeError('');
    try {
      await adminApi.createCoupon(formData);
      setIsModalOpen(false);
      setFormData({ code: '', discountType: 'percentage', discountValue: '', expiresAt: '' });
      setCodeError('');
      fetchCoupons();
    } catch (error) {
      alert('Failed to create coupon');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this coupon?')) {
      try {
        await adminApi.deleteCoupon(id);
        fetchCoupons();
      } catch (error) {
        alert('Delete failed');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5e9da]">
      <AdminSidebar />
      
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-[#1f2933] font-['Playfair_Display']">
            Coupons
          </h1>
          <Button onClick={() => setIsModalOpen(true)}>
            <FiPlus size={20} /> Add Coupon
          </Button>
        </div>

        {isLoading ? (
          <Loader fullScreen={false} />
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#f5e9da]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1f2933]">Code</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1f2933]">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1f2933]">Value</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#1f2933]">Expires</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#1f2933]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-[#f5e9da]/20">
                    <td className="px-6 py-4 text-sm font-medium text-[#1f2933]">{coupon.code}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{coupon.discountType}</td>
                    <td className="px-6 py-4 text-sm text-[#1f2933]">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'No expiry'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(coupon._id)} className="text-red-600 hover:text-red-800">
                        <FiTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Coupon"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Coupon Code"
              name="code"
              value={formData.code}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                setFormData({ ...formData, code: value });
                if (value.trim().length >= 8 && codeError) setCodeError('');
              }}
              placeholder="Enter at least 8 characters"
              minLength={8}
              required
              error={codeError}
            />
            <div>
              <label className="block text-sm font-medium text-[#1f2933] mb-2">Discount Type</label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d5a437]"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <Input
              label="Discount Value"
              type="number"
              step="0.01"
              name="discountValue"
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
              required
            />
            <Input
              label="Expiry Date (Optional)"
              type="date"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
            />
            <Button type="submit" fullWidth>Create Coupon</Button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminCouponsPage;
