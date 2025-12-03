import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiPlus, FiCheck } from 'react-icons/fi';
import { createOrder } from '../store/slices/orderSlice';
import { fetchCart, clearCart } from '../store/slices/cartSlice';
import { fetchAddresses, addAddress } from '../store/slices/addressSlice';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import AddressModal from '../components/address/AddressModal';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, subtotal, discount, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { addresses, isLoading: addressLoading } = useSelector((state) => state.addresses);
  const { isLoading } = useSelector((state) => state.orders);

  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Helper to safely get product data from either structure
  const getProductData = (item) => {
    // If item has product object (from API)
    if (item.product) {
      return {
        id: item.product._id,
        name: item.product.name || item.product.title,
        price: item.price || item.product.price,
      };
    }
    // If item has flat structure (from localStorage)
    return {
      id: item.productId,
      name: item.name,
      price: item.price,
    };
  };

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [notes, setNotes] = useState('');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchAddresses());
  }, [dispatch]);

  // Auto-select default address or first address
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId && !useNewAddress) {
      const defaultAddr = addresses.find(addr => addr.isDefault);
      setSelectedAddressId(defaultAddr?._id || addresses[0]._id);
    }
  }, [addresses, selectedAddressId, useNewAddress]);

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setUseNewAddress(false);
  };

  const handleNewAddressClick = () => {
    setUseNewAddress(true);
    setSelectedAddressId(null);
  };

  const handleSaveNewAddress = async (addressData) => {
    try {
      await dispatch(addAddress(addressData)).unwrap();
      setIsAddressModalOpen(false);
      setUseNewAddress(false);
    } catch (error) {
      alert(error || 'Failed to save address');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!items || items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Get shipping address from selected address or new address form
    let finalShippingAddress;
    if (useNewAddress) {
      finalShippingAddress = shippingAddress;
    } else {
      const selectedAddr = addresses.find(addr => addr._id === selectedAddressId);
      if (!selectedAddr) {
        alert('Please select a delivery address');
        return;
      }
      finalShippingAddress = {
        fullName: selectedAddr.fullName,
        email: user?.email || '',
        phone: selectedAddr.phone,
        address: selectedAddr.address,
        city: selectedAddr.city,
        state: selectedAddr.state,
        zipCode: selectedAddr.zipCode,
        country: selectedAddr.country,
      };
    }

    const orderData = {
      items: items.map((item) => {
        const productData = getProductData(item);
        return {
          product: productData.id,
          quantity: item.quantity,
          price: productData.price,
          variant: item.variant,
        };
      }),
      shippingAddress: finalShippingAddress,
      paymentMethod,
      notes,
      subtotal,
      discount,
      total,
    };

    try {
      const result = await dispatch(createOrder(orderData)).unwrap();
      // Clear the cart after successful order
      await dispatch(clearCart());
      navigate(`/orders/${result._id || result.order?._id}`);
    } catch (error) {
      alert(error || 'Failed to create order');
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5e9da] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Card padding="lg">
            <p className="text-center text-gray-600">Your cart is empty.</p>
            <div className="text-center mt-4">
              <Button onClick={() => navigate('/products')}>Continue Shopping</Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5e9da] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#1f2933] mb-8 font-['Playfair_Display']">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <Card>
                <h2 className="text-2xl font-bold text-[#1f2933] mb-6 font-['Playfair_Display']">
                  Select Delivery Address
                </h2>

                {/* Saved Addresses */}
                {addresses && addresses.length > 0 && (
                  <div className="mb-6">
                    <div className="grid grid-cols-1 gap-3 mb-4">
                      {addresses.map((addr) => (
                        <div
                          key={addr._id}
                          onClick={() => handleAddressSelect(addr._id)}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                            selectedAddressId === addr._id
                              ? 'border-[#2874f0] bg-blue-50'
                              : 'border-gray-200 hover:border-[#2874f0]'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className='font-bold text-gray-900'>{addr.fullName}</span>
                                <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded uppercase">
                                  {addr.addressType}
                                </span>
                                <p className="text-sm text-gray-900 ">
                                  <span className="font-black text-black"></span> {addr.phone}
                                </p>
                                {addr.isDefault && (
                                  <span className="px-2 py-1 bg-green-100 justify-end text-green-700 text-xs font-medium rounded">
                                    DEFAULT
                                  </span>
                                )}

                              </div>
                              <p className="text-sm text-gray-700">
                                {addr.address}
                                {addr.locality && `, ${addr.locality}`}
                              </p>
                              <p className="text-sm text-gray-700">
                                {addr.city}, {addr.state} - {addr.zipCode}
                              </p>
                              {addr.landmark && (
                                <p className="text-sm text-gray-600">Landmark: {addr.landmark}</p>
                              )}
                              
                              {addr.alternatePhone && (
                                <p className="text-sm text-gray-600">Alt Phone: {addr.alternatePhone}</p>
                              )}
                              
                            </div>
                            {selectedAddressId === addr._id && (
                              <div className="ml-3">
                                <div className="w-6 h-6 bg-[#2874f0] rounded-full flex items-center justify-center">
                                  <FiCheck className="text-white" size={16} />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add New Address Button */}
                    <button
                      type="button"
                      onClick={() => setIsAddressModalOpen(true)}
                      className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center gap-2 hover:border-[#2874f0] hover:bg-blue-50 transition-all text-[#2874f0] font-medium"
                    >
                      <FiPlus size={20} />
                      Add New Address
                    </button>
                  </div>
                )}

                {/* Show form for new address if no saved addresses or user chooses new */}
                {(addresses.length === 0 || useNewAddress) && (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="Email"
                        type="email"
                        name="email"
                        value={shippingAddress.email}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="Phone"
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="Country"
                        name="country"
                        value={shippingAddress.country}
                        onChange={handleInputChange}
                        required
                      />
                      <div className="md:col-span-2">
                        <Input
                          label="Address"
                          name="address"
                          value={shippingAddress.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <Input
                        label="City"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="State/Province"
                        name="state"
                        value={shippingAddress.state}
                        onChange={handleInputChange}
                        required
                      />
                      <Input
                        label="ZIP/Postal Code"
                        name="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                )}
              </Card>

              {/* Payment Method */}
              <Card>
                <h2 className="text-2xl font-bold text-[#1f2933] mb-6 font-['Playfair_Display']">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#d5a437] transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-[#d5a437]"
                    />
                    <span className="font-medium text-[#1f2933]">Cash on Delivery</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#d5a437] transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-[#d5a437]"
                    />
                    <span className="font-medium text-[#1f2933]">Qr Code / UPI / Card</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-[#d5a437] transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-[#d5a437]"
                    />
                    <span className="font-medium text-[#1f2933]">Bank Transfer</span>
                  </label>
                </div>
              </Card>

              {/* Order Notes */}
              <Card>
                <h2 className="text-2xl font-bold text-[#1f2933] mb-4 font-['Playfair_Display']">
                  Order Notes (Optional)
                </h2>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any special instructions for your order..."
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d5a437] focus:border-transparent resize-none"
                />
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <h2 className="text-2xl font-bold text-[#1f2933] mb-6 font-['Playfair_Display']">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  {items.map((item, index) => {
                    const productData = getProductData(item);
                    return (
                      <div key={item._id || `item-${index}`} className="flex justify-between text-sm">
                        <span className="text-gray-700">
                          {productData.name} x {item.quantity}
                        </span>
                        <span className="font-medium text-[#1f2933]">
                          ₹{(productData.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
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
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between text-xl font-bold text-[#1f2933]">
                    <span>Total</span>
                    <span>₹{total?.toFixed(2)}</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  className="bg-gray-200 hover:bg-[#eec9af]"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Place Order
                </Button>

                <p className="text-xs text-gray-600 text-center mt-4">
                  By placing your order, you agree to our terms and conditions
                </p>
              </Card>
            </div>
          </div>
        </form>

        {/* Address Modal */}
        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          onSave={handleSaveNewAddress}
          address={null}
          isLoading={addressLoading}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;
