import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiSearch, FiChevronRight } from 'react-icons/fi';
import { fetchUserOrders } from '../store/slices/orderSlice';
import Card from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';
import Loader from '../components/common/Loader';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');

  // Debug: Log auth state
  useEffect(() => {
    console.log('User:', user);
    console.log('Is Authenticated:', isAuthenticated);
  }, [user, isAuthenticated]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  // Debug: Log orders when they change
  useEffect(() => {
    console.log('Orders from Redux:', orders);
    console.log('Is Loading:', isLoading);
  }, [orders, isLoading]);

  const getStatusIcon = (status) => {
    const normalizedStatus = status?.toLowerCase() || '';
    
    if (normalizedStatus.includes('completed') || normalizedStatus.includes('delivered')) {
      return <FiCheckCircle className="text-green-600" size={20} />;
    } else if (normalizedStatus.includes('prepared') || normalizedStatus.includes('accepted')) {
      return <FiTruck className="text-blue-600" size={20} />;
    } else if (normalizedStatus.includes('cancelled') || normalizedStatus.includes('rejected')) {
      return <FiXCircle className="text-red-600" size={20} />;
    } else {
      return <FiClock className="text-orange-600" size={20} />;
    }
  };

  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase() || '';
    
    if (normalizedStatus.includes('completed') || normalizedStatus.includes('delivered')) {
      return 'text-green-700 bg-green-50 border-green-200';
    } else if (normalizedStatus.includes('prepared') || normalizedStatus.includes('accepted')) {
      return 'text-blue-700 bg-blue-50 border-blue-200';
    } else if (normalizedStatus.includes('cancelled') || normalizedStatus.includes('rejected')) {
      return 'text-red-700 bg-red-50 border-red-200';
    } else {
      return 'text-orange-700 bg-orange-50 border-orange-200';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter orders
  const filteredOrders = orders?.filter((order) => {
    // Search filter
    const matchesSearch = !searchQuery || 
      order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items?.some(item => item.title?.toLowerCase().includes(searchQuery.toLowerCase()));

    // Status filter
    const matchesStatus = statusFilter === 'all' || 
      order.status?.toLowerCase().replace(/\s+/g, '') === statusFilter.toLowerCase();

    // Time filter
    let matchesTime = true;
    if (timeFilter !== 'all') {
      const orderDate = new Date(order.orderDate || order.createdAt);
      const now = new Date();
      const diffTime = now - orderDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (timeFilter === 'last30days') {
        matchesTime = diffDays <= 30;
      } else if (timeFilter === '2024') {
        matchesTime = orderDate.getFullYear() === 2024;
      } else if (timeFilter === '2023') {
        matchesTime = orderDate.getFullYear() === 2023;
      } else if (timeFilter === 'older') {
        matchesTime = orderDate.getFullYear() < 2023;
      }
    }

    return matchesSearch && matchesStatus && matchesTime;
  }) || [];

  if (isLoading) {
    return <Loader />;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <EmptyState
          icon={FiPackage}
          title="No Orders Yet"
          message="You haven't placed any orders yet. Start shopping to see your orders here."
          action={() => window.location.href = '/products'}
          actionLabel="Start Shopping"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-[#d5a437]">Home</Link>
          <FiChevronRight size={14} />
          <Link to="/profile" className="hover:text-[#d5a437]">My Account</Link>
          <FiChevronRight size={14} />
          <span className="text-[#1f2933] font-medium">My Orders</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filters */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-bold text-[#1f2933] mb-6">Filters</h2>

              {/* Order Status */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#1f2933] mb-3 uppercase">Order Status</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Orders' },
                    { value: 'neworder', label: 'On the way' },
                    { value: 'completed', label: 'Delivered' },
                    { value: 'cancelled', label: 'Cancelled' },
                    { value: 'rejected', label: 'Returned' },
                  ].map((status) => (
                    <label key={status.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={statusFilter === status.value}
                        onChange={() => setStatusFilter(status.value)}
                        className="w-4 h-4 text-[#d5a437] border-gray-300 rounded focus:ring-[#d5a437]"
                      />
                      <span className="text-sm text-gray-700">{status.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Time */}
              <div>
                <h3 className="text-sm font-semibold text-[#1f2933] mb-3 uppercase">Order Time</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Time' },
                    { value: 'last30days', label: 'Last 30 days' },
                    { value: '2024', label: '2024' },
                    { value: '2023', label: '2023' },
                    { value: 'older', label: 'Older' },
                  ].map((time) => (
                    <label key={time.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={timeFilter === time.value}
                        onChange={() => setTimeFilter(time.value)}
                        className="w-4 h-4 text-[#d5a437] border-gray-300 rounded focus:ring-[#d5a437]"
                      />
                      <span className="text-sm text-gray-700">{time.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search your orders here"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d5a437] focus:border-transparent"
                  />
                </div>
                <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Search Orders
                </button>
              </div>
            </div>

            {/* Orders List */}
            {isLoading ? (
              <Loader />
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <FiPackage size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <Link to={`/orders/${order._id}`}>
                      <div className="p-5 pt-3 pb-2 ">
                        <div className="flex items-start justify-between gap-4 mb-2 ">
                          {/* Product Image & Info */}
                          <div className="flex items-start gap-4 flex-1">
                            {order.items?.[0] && (
                              <div className="shrink-0">
                                <img
                                  src={order.items[0].product?.images?.[0] || 'https://via.placeholder.com/80x80?text=Product'}
                                  alt={order.items[0].title || 'Product'}
                                  className="w-20 h-25 object-fit rounded-lg border border-gray-200"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-semibold text-[#1f2933] mb-1 line-clamp-1">
                                {order.items?.[0]?.title || 'Order Items'}
                              </h3>
                              {order.items?.[0]?.color && (
                                <p className="text-sm text-gray-600 mb-2">
                                  Color: {order.items[0].color}
                                </p>
                              )}
                              {order.items?.length > 1 && (
                                <p className="text-sm text-gray-500">
                                  +{order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right shrink-0">
                            <p className="text-xl font-bold text-[#1f2933]">
                              ₹{order.totalAmount?.toFixed(2) || '0.00'}
                            </p>
                          </div>
                        </div>

                        {/* Status & Date */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                              {order.status === 'New Order' ? 'On the way' : 
                               order.status === 'Completed' ? 'Delivered' :
                               order.status === 'Cancelled' ? 'Cancelled' :
                               order.status === 'Rejected by Store' ? 'Returned' :
                               order.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.status === 'Completed' ? 'Delivered' : 
                             order.status === 'Cancelled' ? 'Cancelled' :
                             order.status === 'Rejected by Store' ? 'Cancelled' : 'Placed'} on{' '}
                            <span className="font-medium text-[#1f2933]">
                              {formatDate(order.orderDate || order.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Additional Info for Delivered Orders */}
                        {order.status === 'Completed' && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm text-gray-600">Your item has been delivered</p>
                            <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                              <FiCheckCircle size={16} />
                              Rate & Review Product
                            </button>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}

                {/* No More Results */}
                <div className="text-center py-8">
                  <p className="text-blue-600 font-medium">No More Results To Display</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
