import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { updateCartItem, removeFromCart } from '../../store/slices/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  // Extract data - handle both API and local storage structures
  const price = item.price || 0;
  const quantity = item.quantity || 1;
  const variant = item.variant;
  
  // For product details, prefer item's direct properties (from local storage)
  // then fall back to nested product object (from API)
  const imageUrl = item.image || item.product?.images?.[0] || 'https://placehold.co/200x300?text=Product';
  const productName = item.name || item.product?.title || item.product?.name || 'Product';

  const handleUpdateQuantity = (newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ itemId: item._id, quantity: newQuantity }));
  };

  const handleRemove = () => {
    if (window.confirm('Remove this item from cart?')) {
      dispatch(removeFromCart(item._id));
    }
  };

  return (
    <div className="flex gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="shrink-0">
        <img
          src={imageUrl}
          alt={productName}
          className="w-24 h-32 object-cover rounded-lg"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-[#1f2933] mb-1 truncate">
          {productName}
        </h3>
        
        {variant && (
          <p className="text-sm text-gray-600 mb-2">
            Size: {variant.name || variant}
          </p>
        )}

        <div className="flex items-center gap-4 mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg">
            <button
              onClick={() => handleUpdateQuantity(quantity - 1)}
              className="p-2 hover:bg-[#f5e9da] transition-colors rounded-l-lg"
              disabled={quantity <= 1}
            >
              <FiMinus size={16} className={quantity <= 1 ? 'text-gray-300' : 'text-[#1f2933]'} />
            </button>
            <span className="px-3 font-medium text-[#1f2933] min-w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleUpdateQuantity(quantity + 1)}
              className="p-2 hover:bg-[#f5e9da] transition-colors rounded-r-lg"
            >
              <FiPlus size={16} className="text-[#1f2933]" />
            </button>
          </div>

          {/* Price */}
          <div className="flex-1">
            <p className="text-lg font-bold text-[#1f2933]">
              ₹ {(price * quantity).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              ₹ {price.toFixed(2)} each
            </p>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Remove from cart"
          >
            <FiTrash2 size={20} />
          </button>
        </div>


      </div>
    </div>
  );
};

export default CartItem;
