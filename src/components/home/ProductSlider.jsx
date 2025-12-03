import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const ProductSlider = ({ products }) => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <div className="relative py-4">
      {/* Previous Button */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg hidden md:flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Previous"
        >
          <FiChevronLeft size={24} className="text-gray-800" />
        </button>
      )}

      {/* Next Button */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg hidden md:flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Next"
        >
          <FiChevronRight size={24} className="text-gray-800" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-4"
        style={{ scrollbarWidth: 'none' }}
      >
        {/* First spacer for centering */}
        <div className="shrink-0 w-0 md:w-4 lg:w-8" />

        {products.map((product) => (
          <div
            key={product._id}
            className="ring-1 ring-inset ring-neutral-200 shrink-0 rounded-md hover:shadow-lg w-[148px] lg:w-48 transition-shadow"
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
                  src={product.images?.[0] || 'https://via.placeholder.com/192x192?text=Product'}
                  alt={product.title || product.name}
                  className="block object-cover h-auto rounded-t-md aspect-square w-full"
                  width="192"
                  height="192"
                />
              </a>
              
              {/* Wishlist Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to wishlist logic
                }}
                className="absolute bottom-0 right-0 mr-2 mb-2 w-8 h-8 bg-white border border-neutral-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                aria-label="Add to wishlist"
              >
                <FiHeart size={14} className="text-gray-700" />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-2 border-t border-neutral-200">
              <a
                href={`/products/${product._id}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/products/${product._id}`);
                }}
                className="text-sm text-gray-700 hover:text-gray-900 no-underline block line-clamp-2 min-h-10"
              >
                {product.title || product.name}
              </a>
              <span className="block mt-2 font-bold text-sm">
                ₹{product.price?.toFixed(2)}
              </span>
            </div>
          </div>
        ))}

        {/* Last spacer for centering */}
        <div className="shrink-0 w-0 md:w-4 lg:w-8" />
      </div>
    </div>
  );
};

export default ProductSlider;
