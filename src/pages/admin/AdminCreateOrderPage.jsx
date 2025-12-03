import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { adminApi } from '../../api/adminApi';
import { FiPlus, FiTrash2, FiShoppingCart } from 'react-icons/fi';
import Loader from '../../components/common/Loader';

const AdminCreateOrderPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  
  const [orderData, setOrderData] = useState({
    customerName: '',
    email: '',
    phone: '',
    orderMethod: 'Delivery',
    deliveryType: 'Immediately',
    status: 'New Order',
    paymentMethod: 'COD',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    notes: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await adminApi.getAllProducts();
      setProducts(response.cloths || response.products || []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = () => {
    setSelectedItems([
      ...selectedItems,
      { product: '', quantity: 1, price: 0 }
    ]);
  };

  const removeItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const newItems = [...selectedItems];
    newItems[index][field] = value;
    
    if (field === 'product') {
      const product = products.find(p => p._id === value);
      if (product) {
        newItems[index].price = product.price;
        newItems[index].title = product.title;
        newItems[index].size = product.size;
        newItems[index].color = product.color;
      }
    }
    
    setSelectedItems(newItems);
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (selectedItems.length === 0) {
      alert('Please add at least one product to the order');
      return;
    }

    const orderPayload = {
      ...orderData,
      items: selectedItems,
      totalAmount: calculateTotal(),
      shippingAddress: {
        street: orderData.street,
        city: orderData.city,
        state: orderData.state,
        zipCode: orderData.zipCode,
        country: orderData.country
      }
    };

    try {
      await adminApi.createOrder(orderPayload);
      alert('Order created successfully!');
      navigate('/admin/orders');
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-8 py-6">
            <h1 className="text-2xl font-bold text-gray-800">Create New Order</h1>
            <p className="text-gray-500 mt-1">Add a new order to the system</p>
          </div>
        </div>

        <div className="p-8">
          {isLoading ? (
            <Loader fullScreen={false} />
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Information */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name *</label>
                        <input
                          type="text"
                          value={orderData.customerName}
                          onChange={(e) => setOrderData({ ...orderData, customerName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={orderData.email}
                          onChange={(e) => setOrderData({ ...orderData, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={orderData.phone}
                          onChange={(e) => setOrderData({ ...orderData, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                        <select
                          value={orderData.paymentMethod}
                          onChange={(e) => setOrderData({ ...orderData, paymentMethod: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="COD">Cash on Delivery</option>
                          <option value="Card">Card</option>
                          <option value="Online">Online</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Shipping Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                        <input
                          type="text"
                          value={orderData.street}
                          onChange={(e) => setOrderData({ ...orderData, street: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={orderData.city}
                          onChange={(e) => setOrderData({ ...orderData, city: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input
                          type="text"
                          value={orderData.state}
                          onChange={(e) => setOrderData({ ...orderData, state: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                        <input
                          type="text"
                          value={orderData.zipCode}
                          onChange={(e) => setOrderData({ ...orderData, zipCode: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                          type="text"
                          value={orderData.country}
                          onChange={(e) => setOrderData({ ...orderData, country: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-gray-800">Order Items</h2>
                      <button
                        type="button"
                        onClick={addItem}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        <FiPlus size={18} />
                        Add Item
                      </button>
                    </div>

                    {selectedItems.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No items added. Click "Add Item" to start.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedItems.map((item, index) => (
                          <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                                <select
                                  value={item.product}
                                  onChange={(e) => updateItem(index, 'product', e.target.value)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  required
                                >
                                  <option value="">Select Product</option>
                                  {products.map((product) => (
                                    <option key={product._id} value={product._id}>
                                      {product.title} - ₹{product.price} ({product.size}, {product.color})
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subtotal</label>
                                <input
                                  type="text"
                                  value={`₹${(item.price * item.quantity).toFixed(2)}`}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                  disabled
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="mt-8 text-red-500 hover:text-red-700 transition-colors"
                            >
                              <FiTrash2 size={20} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Additional Notes</h2>
                    <textarea
                      value={orderData.notes}
                      onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      rows="4"
                      placeholder="Enter any additional notes or special instructions..."
                    />
                  </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Order Method</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setOrderData({ ...orderData, orderMethod: 'Delivery' })}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                              orderData.orderMethod === 'Delivery'
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Delivery
                          </button>
                          <button
                            type="button"
                            onClick={() => setOrderData({ ...orderData, orderMethod: 'Pickup' })}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                              orderData.orderMethod === 'Pickup'
                                ? 'bg-orange-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            Pickup
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={orderData.status}
                          onChange={(e) => setOrderData({ ...orderData, status: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="New Order">New Order</option>
                          <option value="Accepted by Restaurant">Accepted by Restaurant</option>
                          <option value="Prepared">Prepared</option>
                          <option value="Rejected by Store">Rejected by Store</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Items:</span>
                          <span className="font-medium">{selectedItems.length}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-semibold text-gray-800">Total:</span>
                          <span className="text-2xl font-bold text-orange-500">
                            ₹{calculateTotal().toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button
                          type="submit"
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                        >
                          <FiShoppingCart size={20} />
                          Create Order
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate('/admin/orders')}
                          className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminCreateOrderPage;
