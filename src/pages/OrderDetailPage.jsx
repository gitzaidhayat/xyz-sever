import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FiChevronRight, 
  FiCheckCircle, 
  FiXCircle, 
  FiHome, 
  FiUser, 
  FiCopy,
  FiMessageCircle,
  FiChevronUp,
  FiChevronDown
} from 'react-icons/fi';
import { fetchOrderById } from '../store/slices/orderSlice';
import Loader from '../components/common/Loader';
import { useState } from 'react';
import { MdLocalPhone } from "react-icons/md";

const OrderDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, isLoading } = useSelector((state) => state.orders);
  const [showFees, setShowFees] = useState(false);

  // Scroll to top when component mounts or ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  const copyOrderId = () => {
    navigator.clipboard.writeText(currentOrder.orderId);
    alert('Order ID copied to clipboard!');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusTimeline = () => {
    if (!currentOrder) return [];

    const timeline = [
      {
        status: 'Order Confirmed',
        date: currentOrder.orderDate || currentOrder.createdAt,
        completed: true,
      },
    ];

    if (currentOrder.status === 'Completed') {
      timeline.push({
        status: 'Delivered',
        date: currentOrder.expectedDeliveryDate || currentOrder.updatedAt,
        completed: true,
      });
    } else if (currentOrder.status === 'Cancelled' || currentOrder.status === 'Rejected by Store') {
      timeline.push({
        status: currentOrder.status === 'Cancelled' ? 'Cancelled' : 'Cancelled',
        date: currentOrder.updatedAt,
        completed: true,
        cancelled: true,
      });
    } else if (currentOrder.status === 'Prepared' || currentOrder.status === 'Accepted by Restaurant') {
      timeline.push({
        status: 'In Progress',
        date: currentOrder.updatedAt,
        completed: true,
      });
    }

    return timeline;
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h2>
          <Link to="/orders" className="text-[#d5a437] hover:underline">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const timeline = getStatusTimeline();
  const isCancelled = currentOrder.status === 'Cancelled' || currentOrder.status === 'Rejected by Store';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-[#d5a437]">Home</Link>
          <FiChevronRight size={14} />
          <Link to="/profile" className="hover:text-[#d5a437]">My Account</Link>
          <FiChevronRight size={14} />
          <Link to="/orders" className="hover:text-[#d5a437]">My Orders</Link>
          <FiChevronRight size={14} />
          <span className="text-[#1f2933] font-medium">{currentOrder.orderId}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tracking Info */}
            {/* <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-1">
                  Order can be tracked by {currentOrder.orderId || '900142703'}.
                </p>
                <p className="text-sm text-gray-600">
                  Tracking link is shared via SMS.
                </p>
              </div>

              
            </div> */}

            {/* Product Details */}
            {currentOrder.items?.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex gap-4 mb-6">
                  <div className="shrink-0">
                    <img
                      src={item.product?.images?.[0] || 'https://via.placeholder.com/120x120?text=Product'}
                      alt={item.title}
                      className="w-24 h-24 object-contain  "
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-[#1f2933] mb-1">
                      {item.title}
                    </h3>
                    {item.product?.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        Seller: {item.product.description.substring(0, 50)}...
                      </p>
                    )}
                    <p className="text-xl font-bold text-[#1f2933]">
                      ₹{item.price?.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Order Timeline */}
                <div className="space-y-4">
                  {timeline.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className={`shrink-0 mt-1 ${step.cancelled ? 'text-red-600' : 'text-green-600'}`}>
                        {step.cancelled ? (
                          <FiXCircle size={24} />
                        ) : (
                          <FiCheckCircle size={24} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#1f2933]">
                          {step.status}, {formatDate(step.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cancellation Message */}
                {isCancelled && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-700">
                      Sorry, your order was cancelled due to an unexpected issue.
                    </p>
                  </div>
                )}
              </div>
            ))}

            {/* Chat Button */}
            <button className="w-full bg-white rounded-lg shadow-sm p-4 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              <FiMessageCircle size={20} />
              <span className="font-medium text-[#1f2933]">Chat with us</span>
            </button>

            {/* Order ID */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Order #{currentOrder.orderId}</span>
                <button
                  onClick={copyOrderId}
                  className="text-blue-600 hover:text-blue-700"
                  title="Copy Order ID"
                >
                  <FiCopy size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Delivery Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-[#1f2933] mb-4">Delivery details</h3>

              <div className="space-y-4  bg-gray-50 rounded-xl h-[120px] w-[350px]">
                {/* Address */}
                <div className="pl-5 flex items-start gap-3">
                  <FiHome size={20} className="font-bold! text-black mt-1" />
                  <div className="flex-1">
                    <h3 className="font-medium! text-[#1f2933] mb-1">Home</h3>
                    <p className="text-sm text-gray-700">
                      {currentOrder.shippingAddress?.street }{','} {currentOrder.shippingAddress?.city || ''}
                      {', '}{currentOrder.shippingAddress?.state || ''} {' - '}{currentOrder.shippingAddress?.zipCode || ''}
                    </p>
                  </div>
                </div>

                {/* Customer */}
                <div className=" pl-5 flex items-start gap-3">
                  <MdLocalPhone size={20} className="font-bold! text-black mt-1" />
                  <div className="flex-1">
                    <p className="font-medium! text-[#1f2933] mb-1">
                      {}
                    </p>
                    <p className="text-sm text-gray-600">
                      {currentOrder.user?.phone || currentOrder.shippingAddress?.phone}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-bold text-[#1f2933] mb-4">Price details</h3>

              <div className="space-y-3">
                {/* Listing Price */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Listing price</span>
                  <span className="text-[#1f2933]">
                    ₹{(currentOrder.totalAmount * 1.1).toFixed(2)}
                  </span>
                </div>

                {/* Selling Price */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Selling price</span>
                  <span className="text-[#1f2933]">
                    ₹{currentOrder.totalAmount?.toFixed(2)}
                  </span>
                </div>

                {/* Total Fees */}
                <div>
                  <button
                    onClick={() => setShowFees(!showFees)}
                    className="w-full flex items-center justify-between text-sm py-1"
                  >
                    <span className="text-gray-600">Total fees</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#1f2933]">₹5</span>
                      {showFees ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                    </div>
                  </button>
                  {showFees && (
                    <div className="ml-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>Payment Handling Fee</span>
                        <span>₹5</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-gray-300 my-3"></div>

                {/* Total Amount */}
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-[#1f2933]">Total amount</span>
                  <span className="text-[#1f2933] text-lg">
                    ₹{currentOrder.totalAmount?.toFixed(2)}
                  </span>
                </div>

                {/* Payment Method */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Payment method</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[#1f2933] font-medium">
                        {currentOrder.paymentMethod === 'COD' ? 'Cash On Delivery' : currentOrder.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
