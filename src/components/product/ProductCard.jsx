import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import Card from '../common/Card';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ 
      productId: product._id, 
      quantity: 1,
      product: product // Pass the full product data for local storage fallback
    }));
  };

  // Fallback image if product has no images
  const imageUrl = product.images?.[0] || 'https://via.placeholder.com/400x600?text=Abaya';
  const productName = product.title || product.name || 'Untitled Product';

  return (
    <Card hover className="group overflow-hidden ">
      <Link to={`/products/${product._id}`}>
        {/* Image */}
        <div className="relative overflow-hidden rounded-xl  bg-white">
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-300"
          />

          {/* Quick Add Button */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#eec9af] opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-[#eec9af] hover:text-white"
          >
            <FiShoppingCart size={20} className="" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          {/* Name */}
          <h3 className="text-lg font-semibold text-[#1f2933] line-clamp-2 min-h-14">
            {productName}
          </h3>

          {/* Color & Size */}
          <div className="flex items-center gap-3 text-sm text-gray-600">
            {product.color && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: product.color.toLowerCase() }}></span>
                {product.color}
              </span>
            )}
            {product.size && (
              <span>Size: {product.size}</span>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-[#1f2933]">
              ₹ {product.price?.toFixed(2)}
            </p>
          </div>


        </div>
      </Link>
    </Card>
  );
};

export default ProductCard;
