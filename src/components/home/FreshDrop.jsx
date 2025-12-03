import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiChevronLeft, FiChevronRight, FiHeart } from 'react-icons/fi';
import { fetchProducts } from '../../store/slices/productSlice';

const FreshDrop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, isLoading } = useSelector((state) => state.products);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 20 }));
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, products.length - itemsPerPage) : Math.max(0, prev - itemsPerPage)));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => {
      const maxIndex = Math.max(0, products.length - itemsPerPage);
      return prev >= maxIndex ? 0 : Math.min(maxIndex, prev + itemsPerPage);
    });
  };

  const visibleProducts = products.slice(currentIndex, currentIndex + itemsPerPage);

  const calculateDiscount = (price, comparePrice) => {
    if (!comparePrice || comparePrice <= price) return 0;
    return Math.round(((comparePrice - price) / comparePrice) * 100);
  };

  if (isLoading || products.length === 0) {
    return null;
  }

  return (
    <section className="mt-1 py-5 px-4 bg-white">
      <div className="max-w-screen mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 tracking-wider mb-8">
            FRESH DROP
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-screen mx-auto">
          {/* Navigation Buttons */}
          {products.length > itemsPerPage && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Previous products"
              >
                <FiChevronLeft size={24} className="text-gray-800" />
              </button>

              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Next products"
              >
                <FiChevronRight size={24} className="text-gray-800" />
              </button>
            </>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleProducts.map((product) => {
              const discount = calculateDiscount(product.price, product.comparePrice);
              
              return (
                <div
                  key={product._id}
                  className="group relative bg-[#c9a58a] rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div className="absolute top-4 left-4 z-10 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded">
                      SAVE {discount}%
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to wishlist logic here
                    }}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <FiHeart size={20} className="text-gray-700" />
                  </button>

                  {/* Product Image */}
                  <div className="relative aspect-3/4 overflow-hidden">
                    <img
                      src={product.images?.[0] || 'https://via.placeholder.com/400x600?text=Product'}
                      alt={product.title || product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4 bg-white">
                    <h3 className="text-sm text-gray-700 mb-2 line-clamp-2 min-h-10">
                      {product.title || product.name}
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-red-500">
                        Rs. {product.price?.toFixed(2)}
                      </span>
                      {product.comparePrice && product.comparePrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          Rs. {product.comparePrice?.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quick Add Button (appears on hover) */}
                  <div className="absolute bottom-16 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${product._id}`);
                      }}
                      className="w-full bg-white text-gray-800 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <span className="text-xl">+</span>
                      Quick Add
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-2 mb-1 ">
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-gray-800 text-white font-normal! uppercase tracking-wider hover:bg-gray-700 transition-colors cursor-pointer"
          >
            VIEW ALL
          </button>
        </div>
      </div>
    </section>
  );
};

export default FreshDrop;
