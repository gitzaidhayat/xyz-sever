import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiDollarSign,
  FiShoppingCart,
  FiEye,
  FiTrendingUp,
  FiTrendingDown,
  FiMoreVertical,
  FiPackage,
  FiClock,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import { adminApi } from '../../api/adminApi';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/common/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('daily');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsData, ordersData] = await Promise.all([
        adminApi.getDashboardStats().catch(() => null),
        adminApi.getAllOrders({ limit: 5 }).catch(() => ({ orders: [] }))
      ]);
      
      // Set stats with fallback to mock data
      setStats(statsData || {
        totalSales: 983410,
        salesChange: 3.48,
        totalOrders: 58375,
        ordersChange: -2.86,
        totalVisitors: 237782,
        visitorsChange: 8.35,
        conversionRate: 65,
        activeUsers: 2758,
        activeUsersChange: -6.02,
        productViews: 25000,
        productViewsChange: 3,
        returns: 8500,
        returnsChange: 8,
        completed: 6200,
        completedChange: 12
      });
      
      setOrders(ordersData?.orders || []);
      
      // Mock activities
      // setActivities([
      //   { id: 1, text: 'Marcus Rhiel purchased 2 items totaling ₹150', time: '10:30 AM', type: 'purchase' },
      //   { id: 2, text: 'The price of "Smart TV" was updated from ₹600 to ₹450', time: '9:15 AM', type: 'update' },
      //   { id: 3, text: 'Vincent Laurent left a 5-star review for "Wireless Headphones"', time: '8:45 AM', type: 'review' },
      //   { id: 4, text: '"Running Shoes" stock is below 10 units', time: '7:30 AM', type: 'alert' },
      //   { id: 5, text: 'Darwin Lupo order status changed from "Pending" to "Processing"', time: '7:02 AM', type: 'status' },
      // ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set default stats even on error
      setStats({
        totalSales: 983410,
        salesChange: 3.48,
        totalOrders: 58375,
        ordersChange: -2.86,
        totalVisitors: 237782,
        visitorsChange: 8.35,
        conversionRate: 65,
        activeUsers: 2758,
        activeUsersChange: -6.02,
        productViews: 25000,
        productViewsChange: 3,
        returns: 8500,
        returnsChange: 8,
        completed: 6200,
        completedChange: 12
      });
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, change, trend, color }) => {
    const isPositive = trend === 'up';
    const TrendIcon = isPositive ? FiTrendingUp : FiTrendingDown;
    
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon size={24} className="text-white" />
          </div>
          {change && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
              isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              <TrendIcon size={14} />
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-1">{label}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back, here's what's happening</p>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="search"
                  placeholder="Search stock, order, etc."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
                />
                <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                  🔔
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                  <img
                    src="https://ui-avatars.com/api/?name=Admin&background=ff6b35&color=fff"
                    alt="Admin"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Marcus George</p>
                    <p className="text-xs text-gray-500">Customer Associate</p>
                  </div>
                  <button className="text-gray-400">▼</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={FiDollarSign}
              label="Total Sales"
              value={`₹${stats.totalSales?.toLocaleString() || '0'}`}
              change={stats.salesChange}
              trend={stats.salesChange > 0 ? 'up' : 'down'}
              color="bg-orange-500"
            />
            <StatCard
              icon={FiShoppingCart}
              label="Total Orders"
              value={stats.totalOrders?.toLocaleString() || '0'}
              change={stats.ordersChange}
              trend={stats.ordersChange > 0 ? 'up' : 'down'}
              color="bg-blue-500"
            />
            <StatCard
              icon={FiEye}
              label="Total Visitors"
              value={stats.totalVisitors?.toLocaleString() || '0'}
              change={stats.visitorsChange}
              trend={stats.visitorsChange > 0 ? 'up' : 'down'}
              color="bg-green-500"
            />
            <StatCard
              icon={FiPackage}
              label="Top Categories"
              value="See All"
              color="bg-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Analytics */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Revenue Analytics</h2>
                  <div className="flex items-center gap-4 mt-2">
                    <button className="text-sm font-medium text-orange-600 border-b-2 border-orange-600 pb-1">
                      Revenue
                    </button>
                    <button className="text-sm text-gray-500 hover:text-gray-700">
                      Expenses
                    </button>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600">
                  Last 6 Days
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">12 Aug</span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{width: '45%'}}></div>
                    </div>
                  </div>
                  <span className="font-medium text-gray-800">₹14,521</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">13 Aug</span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{width: '65%'}}></div>
                    </div>
                  </div>
                  <span className="font-medium text-gray-800">₹18,432</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">14 Aug</span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{width: '55%'}}></div>
                    </div>
                  </div>
                  <span className="font-medium text-gray-800">₹16,234</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">15 Aug</span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{width: '75%'}}></div>
                    </div>
                  </div>
                  <span className="font-medium text-gray-800">₹20,876</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">16 Aug</span>
                  <div className="flex-1 mx-4">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{width: '50%'}}></div>
                    </div>
                  </div>
                  <span className="font-medium text-gray-800">₹15,123</span>
                </div>
              </div>
            </div>

            {/* Monthly Target */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Monthly Target</h2>
                <button className="text-gray-400">
                  <FiMoreVertical />
                </button>
              </div>
              
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="#f3f4f6"
                      strokeWidth="16"
                      fill="none"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="80"
                      stroke="url(#gradient)"
                      strokeWidth="16"
                      fill="none"
                      strokeDasharray="502"
                      strokeDashoffset="150"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ff6b35" />
                        <stop offset="100%" stopColor="#f7931e" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl font-bold text-gray-800">65%</p>
                    <p className="text-sm text-gray-500 mt-1">Great Progress! 🎉</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Target</span>
                  <span className="font-semibold text-gray-800">₹610,000</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Goal</span>
                  <span className="font-semibold text-gray-800">₹600,500</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active User */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Active User</h2>
                <button className="text-gray-400">
                  <FiMoreVertical />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-800">{stats.activeUsers?.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">Users</span>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                  <FiTrendingUp size={16} />
                  <span>+6.02%</span>
                  <span className="text-gray-500">from last month</span>
                </div>
              </div>

              <div className="space-y-3">
                {['United States', 'United Kingdom', 'Indonesia', 'Myanmar', 'Russia'].map((country, i) => {
                  const percentage = [33, 21, 17.5, 15, 15][i];
                  return (
                    <div key={country}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-700">{country}</span>
                        <span className="font-medium text-gray-800">{percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-500 rounded-full" 
                          style={{width: `${percentage}%`}}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Conversion Rate</h2>
                <button className="text-gray-400">
                  <FiMoreVertical />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FiPackage className="text-orange-600" size={20} />
                    <span className="text-sm text-gray-600">Product</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">25,000</p>
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs text-green-600">
                    <FiTrendingUp size={12} />
                    <span>+3%</span>
                  </div>
                </div>

                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FiShoppingCart className="text-blue-600" size={20} />
                    <span className="text-sm text-gray-600">Add to</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">12,000</p>
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs text-green-600">
                    <FiTrendingUp size={12} />
                    <span>+6%</span>
                  </div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FiClock className="text-purple-600" size={20} />
                    <span className="text-sm text-gray-600">Proceed to</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">8,500</p>
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs text-green-600">
                    <FiTrendingUp size={12} />
                    <span>+8%</span>
                  </div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FiCheck className="text-green-600" size={20} />
                    <span className="text-sm text-gray-600">Completed</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">6,200</p>
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs text-green-600">
                    <FiTrendingUp size={12} />
                    <span>+12%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Traffic Sources */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Traffic Sources</h2>
                <button className="text-gray-400">
                  <FiMoreVertical />
                </button>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <div className="h-40 flex items-end gap-2">
                    <div className="flex-1 bg-orange-200 rounded-t-lg" style={{height: '80%'}}></div>
                    <div className="flex-1 bg-orange-300 rounded-t-lg" style={{height: '60%'}}></div>
                    <div className="flex-1 bg-orange-400 rounded-t-lg" style={{height: '90%'}}></div>
                    <div className="flex-1 bg-orange-500 rounded-t-lg" style={{height: '100%'}}></div>
                    <div className="flex-1 bg-orange-600 rounded-t-lg" style={{height: '70%'}}></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Direct Traffic', value: '40%' },
                  { name: 'Organic Search', value: '30%' },
                  { name: 'Social Media', value: '15%' },
                  { name: 'Referral Traffic', value: '10%' },
                  { name: 'Email Campaigns', value: '5%' },
                ].map((source, i) => (
                  <div key={source.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-orange-${(i + 2) * 100}`}></div>
                      <span className="text-gray-700">{source.name}</span>
                    </div>
                    <span className="font-semibold text-gray-800">{source.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                <Link to="/admin/orders" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                  All Categories →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Total</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { id: 1, orderId: '#10236', customer: 'Amaya Miller', product: 'Wireless Headphones', qty: 2, total: '₹ 150', status: 'Shipped' },
                      { id: 2, orderId: '#10235', customer: 'Sebastian Adams', product: 'Running Shoes', qty: 1, total: '₹75', status: 'Processing' },
                      { id: 3, orderId: '#10236', customer: 'Susanne Bright', product: 'Smartwatch', qty: 1, total: '₹250', status: 'Delivered' },
                      { id: 4, orderId: '#10237', customer: 'Peter Head', product: 'Coffee Maker', qty: 1, total: '₹80', status: 'Pending' },
                      { id: 5, orderId: '#10238', customer: 'Anita Singh', product: 'Bluetooth Speaker', qty: 3, total: '₹90', status: 'Shipped' },
                    ].map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-700">{order.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{order.orderId}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{order.customer}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{order.product}</td>
                        <td className="px-6 py-4 text-sm text-gray-700">{order.qty}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-800">{order.total}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'Shipped' ? 'bg-orange-100 text-orange-700' :
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
                <button className="text-gray-400">
                  <FiMoreVertical />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      activity.type === 'purchase' ? 'bg-green-100' :
                      activity.type === 'update' ? 'bg-blue-100' :
                      activity.type === 'review' ? 'bg-orange-100' :
                      activity.type === 'alert' ? 'bg-red-100' :
                      'bg-purple-100'
                    }`}>
                      {activity.type === 'purchase' ? '🛒' :
                       activity.type === 'update' ? '💲' :
                       activity.type === 'review' ? '⭐' :
                       activity.type === 'alert' ? '⚠️' :
                       '📦'}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{activity.text}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
