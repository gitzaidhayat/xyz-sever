import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiTrash2 } from 'react-icons/fi';
import { fetchCart, clearCart, applyCoupon, removeCoupon } from '../store/slices/cartSlice';
import CartItem from '../components/cart/CartItem';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, subtotal, discount, total, coupon, isLoading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    await dispatch(applyCoupon(couponCode));
    setCouponCode('');
    setCouponLoading(false);
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5e9da] py-12">
        <EmptyState
          title="Your Cart is Empty"
          message="Looks like you haven't added any items to your cart yet."
          action={() => navigate('/products')}
          actionLabel="Continue Shopping"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5e9da] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-[#1f2933] font-['Playfair_Display']">
            Shopping Cart
          </h1>
          <button
            onClick={handleClearCart}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
          >
            <FiTrash2 size={20} />
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items && items.length > 0 && items.map((item, index) => (
              <CartItem key={item._id || `cart-item-${index}`} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <h2 className="text-2xl font-bold text-[#1f2933] mb-6 font-['Playfair_Display']">
                Order Summary
              </h2>

              {/* Coupon */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                {coupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                    <div>
                      <p className="text-sm font-medium text-green-800">
                        Coupon Applied: {coupon.code}
                      </p>
                      <p className="text-xs text-green-600">
                        {coupon.discountType === 'percentage' 
                          ? `${coupon.discountValue}% off` 
                          : `₹${coupon.discountValue} off`
                        }
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#1f2933]">
                      Have a coupon?
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eec9af] focus:border-transparent"
                      />
                      <Button
                        onClick={handleApplyCoupon}
                        isLoading={couponLoading}
                        disabled={!couponCode.trim()}
                        size="sm"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium">₹{subtotal?.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold text-[#1f2933]">
                  <span>Total</span>
                  <span>₹{total?.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button onClick={handleCheckout} size="lg" fullWidth>
                Proceed to Checkout
              </Button>

              <Button
                onClick={() => navigate('/products')}
                variant="secondary"
                size="md"
                fullWidth
                className="mt-3"
              >
                Continue Shopping
              </Button>

              {/* Security Badge */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                  🔒 Secure checkout with SSL encryption
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
