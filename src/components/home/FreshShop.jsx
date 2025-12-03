import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { fetchProducts } from '../../store/slices/productSlice';
import { addToCart } from '../../store/slices/cartSlice';

function FreshShop() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 50 }));
  }, [dispatch]);

  const calculateDiscount = (price, comparePrice) => {
    if (!comparePrice || comparePrice <= price) return 0;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    dispatch(addToCart({
      _id: product._id,
      name: product.title || product.name,
      price: product.price,
      image: product.images?.[0],
      quantity: 1,
    }));
    alert(`${product.title || product.name} has been added to your cart!`);
  };

  const handleShowMore = () => {
    setVisibleCount(prev => Math.min(prev + 12, products.length));
  };

  if (isLoading || products.length === 0) {
    return null;
  }

  const visibleProducts = products.slice(0, visibleCount);

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto max-w-screen">
        {/* Header */}
        <div className="widget-title text-center mb-8">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            New Arrivals
          </h3>
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div></div>
            <a 
              href="/products" 
              onClick={(e) => { e.preventDefault(); navigate('/products'); }}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium"
            >
              View All
            </a>
          </div>
        </div>

        {/* Products Grid */}
        <div className="widget-product">
          <div className="products-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {visibleProducts.map((product, index) => {
              const discount = calculateDiscount(product.price, product.comparePrice);
              
              return (
                <div
                  key={product._id}
                  className="border border-neutral-200 rounded-md hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Product Image */}
                  <div className="relative">
                    <a
                      href={`/products/${product._id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/products/${product._id}`);
                      }}
                      className="block"
                    >
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/300x300?text=Product'}
                        alt={product.title || product.name}
                        className="object-cover object-top h-auto rounded-t-md aspect-square w-full"
                        width="300"
                        height="300"
                        loading={index < 4 ? 'eager' : 'lazy'}
                      />
                    </a>
                    
                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add to wishlist logic
                      }}
                      className="absolute bottom-0 right-0 mr-2 mb-2 bg-white ring-1 ring-inset ring-neutral-200 rounded-full p-2 hover:bg-gray-50 transition-colors"
                      aria-label="Add to wishlist"
                    >
                      <FiHeart size={16} className="text-gray-700" />
                    </button>

                    {/* Discount Badge */}
                    {discount > 0 && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4 border-t border-neutral-200">
                    {/* Product Title */}
                    <a
                      href={`/products/${product._id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/products/${product._id}`);
                      }}
                      className="text-gray-700 hover:text-gray-900 font-medium no-underline block mb-1"
                    >
                      {product.title || product.name}
                    </a>

                    {/* Rating & Reviews */}
                    <div className="flex items-center pt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            size={12}
                            className={i < (product.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <a
                        href={`/products/${product._id}#reviews`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/products/${product._id}`);
                        }}
                        className="pl-1 no-underline text-gray-600 hover:text-gray-900"
                      >
                        <span className="text-xs">({product.reviewCount || 0})</span>
                      </a>
                    </div>

                    {/* Product Description */}
                    {/* <p className="block py-2 text-sm text-neutral-700 line-clamp-2">
                      {product.description || 'Premium quality • Comfortable fit • Elegant design'}
                    </p> */}

                    {/* Price */}
                    <div className="pb-2">
                      {product.comparePrice && product.comparePrice > product.price ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-red-500">
                            ₹{product.price?.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.comparePrice?.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <span className="block font-bold text-lg">₹{product.price?.toFixed(2)}</span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-full bg-gray-900 text-white text-sm py-2 px-4 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <FiShoppingCart size={16} />
                      Add to cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show More Button */}
          {visibleCount < products.length && (
            <div className="infinite-scrolling-homepage text-center mt-8">
              <button
                onClick={handleShowMore}
                className="px-8 py-3 bg-gray-800 text-white text-sm uppercase tracking-wider hover:bg-gray-700 transition-colors"
              >
                Show more products
              </button>
            </div>
          )}

          {visibleCount >= products.length && products.length > 12 && (
            <div className="text-center mt-8">
              <p className="text-gray-500 text-sm">No more products</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default FreshShop;
