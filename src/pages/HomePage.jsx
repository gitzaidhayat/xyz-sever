import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";
import Loader from "../components/common/Loader";
import HeroSlider from "../components/home/HeroSlider";
import Testimonials from "../components/home/Testimonials";
import FeedbackSection from "../components/home/FeedbackSection";
import FreshShop from "../components/home/FreshShop";
import ShopByCategory from "../components/home/ShopByCategory";
import PromoBanner from "../components/home/PromoBanner";

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, isLoading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 8 }));
  }, [dispatch]);

  // Note: products, isLoading, error are observed via Redux; no local effect needed

  const heroSlides = [
    {
      src: "https://ik.imagekit.io/j90xpcrfe/beautiful-women-wearing-hijab.jpg?updatedAt=1763359214484",
      alt: "Elegant Abaya 1",
      title: "Where tradition embraces luxury",
      subtitle: "Feel the glam — buy the look",
      badge: "Premium Collection",
      ctaText: "Shop Wholesale",
      onClick: () => navigate("/products"),
    },
    {
      src: "https://ik.imagekit.io/j90xpcrfe/bg-1.jpg?updatedAt=1763291356188",
      alt: "Elegant Abaya 2",
      title: "Wrapped in beauty, shaped by you",
      subtitle: "Wrap yourself in modest luxury — shop the best",
      badge: "Best Seller",
      ctaText: "View Premium",
      onClick: () => navigate("/products?category=premium"),
    },
    {
      src: "https://ik.imagekit.io/j90xpcrfe/bg-4.jpg?updatedAt=1763291361588",
      alt: "Elegant Abaya 3",
      title: "Feel the glam — buy the look",
      subtitle: "Luxury that moves with you — explore now",
      ctaText: "Shop Casual",
      onClick: () => navigate("/products?category=casual"),
    },
    {
      src: "https://ik.imagekit.io/j90xpcrfe/bg-3.webp?updatedAt=1763291356150",
      alt: "Elegant Abaya 4",
      title: "Where grace becomes your signature",
      subtitle: "Authentic looks with a modern touch.",
      ctaText: "Explore Classic",
      onClick: () => navigate("/products?category=classic"),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="p-0 m-0">
        <HeroSlider slides={heroSlides} autoPlay={true} delay={4000} />
      </section>

      {/* New Arrivals / Fresh Shop */}
      <FreshShop />

      {/* Shop by Category */}
      <ShopByCategory />

      {/* Featured Products */}
      <section className="py-10 md:py-16 px-3 sm:px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="widget-title mb-8">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
                Featured Products
              </h3>
              <Link
                to="/products"
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                View All
              </Link>
            </div>
          </div>

          {isLoading ? (
            <Loader fullScreen={false} />
          ) : error ? (
            <div className="text-center py-10 md:py-12">
              <p className="text-red-600 text-lg mb-4">
                Error loading products: {error}
              </p>
              <button
                onClick={() => dispatch(fetchProducts({ limit: 16 }))}
                className="px-6 py-2 bg-[#d5a437] text-white rounded-lg hover:bg-[#e0b54d]"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-10 md:py-12">
              <p className="text-gray-600 text-lg">No products found</p>
            </div>
          ) : (
            <div className="widget-product">
              <div className="products-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {products.slice(0, 16).map((product, index) => (
                  <div
                    key={product._id}
                    className="border border-neutral-200 rounded-md hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Product Image */}
                    <div className="relative">
                      <Link
                        to={`/products/${product._id}`}
                        className="block"
                      >
                        <img
                          src={product.images?.[0] || product.image || 'https://via.placeholder.com/300x300?text=Product'}
                          alt={product.title}
                          className="object-cover object-top h-auto rounded-t-md aspect-square w-full"
                          width="300"
                          height="300"
                          loading={index < 4 ? 'eager' : 'lazy'}
                        />
                      </Link>
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert('Added to wishlist!');
                        }}
                        className="absolute bottom-0 right-0 mr-2 mb-2 bg-white ring-1 ring-inset ring-neutral-200 rounded-full p-2 hover:bg-gray-50 transition-colors"
                        aria-label="Add to wishlist"
                      >
                        <i className="fa fa-heart text-gray-700" aria-hidden="true"></i>
                      </button>

                      {/* Discount Badge */}
                      {product.discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          -{product.discount}%
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 border-t border-neutral-200">
                      {/* Product Title */}
                      <Link
                        to={`/products/${product._id}`}
                        className="text-gray-700 hover:text-gray-900 font-medium no-underline block mb-1"
                      >
                        {product.title}
                      </Link>

                      {/* Price */}
                      <div className="pb-2">
                        {product.discount > 0 ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-red-500">
                              ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ₹{product.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="block font-bold text-lg">₹{product.price?.toFixed(2)}</span>
                        )}
                      </div>

                      {/* Color Swatches */}
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex gap-2 flex-wrap mb-3">
                          {product.colors.slice(0, 4).map((color, idx) => (
                            <div
                              key={idx}
                              title={color}
                              className="w-6 h-6 rounded-full border-2 border-gray-300 cursor-pointer hover:border-[#d5a437] transition-colors"
                              style={{
                                backgroundColor: color.toLowerCase(),
                              }}
                            ></div>
                          ))}
                          {product.colors.length > 4 && (
                            <Link
                              to={`/products/${product._id}`}
                              className="text-xs text-gray-600 hover:text-[#d5a437] flex items-center"
                            >
                              +{product.colors.length - 4}
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Why Choose Us */}
      {/* <section className="py-16 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-[#1f2933] text-center mb-12 font-['Playfair_Display']">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#eec9af]/10 flex items-center justify-center">
                  <feature.icon size={40} className="text-[#eec9af]" />
                </div>
                <h3 className="text-xl font-semibold text-[#1f2933] mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Promo Banner */}
      <PromoBanner />

      {/* CTA Section */}
      

      {/* Feedback & Trustpilot Section */}
      <FeedbackSection />

      {/* Best Sellers Section */}
      <section className="py-10 md:py-16 px-3 sm:px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="widget-title text-center mb-8">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              BEST SELLER
            </h3>
            <div className="flex justify-between items-center max-w-7xl mx-auto">
              <div></div>
              <Link
                to="/products"
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                View All
              </Link>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <Loader fullScreen={false} />
          ) : error ? (
            <div className="text-center py-10 md:py-12">
              <p className="text-red-600 text-lg mb-4">
                Error loading products: {error}
              </p>
              <button
                onClick={() => dispatch(fetchProducts({ limit: 8 }))}
                className="px-6 py-2 bg-[#d5a437] text-white rounded-lg hover:bg-[#e0b54d]"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-10 md:py-12">
              <p className="text-gray-600 text-lg">No products found</p>
            </div>
          ) : (
            <div className="widget-product">
              <div className="products-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {products.slice(0, 8).map((product, index) => (
                  <div
                    key={product._id}
                    className="rounded-md hover:shadow-lg transition-shadow duration-300"
                  >
                    {/* Product Image */}
                    <div className="relative">
                      <Link
                        to={`/products/${product._id}`}
                        className="block"
                      >
                        <img
                          src={product.images?.[0] || product.image || 'https://via.placeholder.com/300x300?text=Product'}
                          alt={product.title}
                          className="object-cover object-top h-auto rounded-t-md aspect-square w-full"
                          width="300"
                          height="300"
                          loading="lazy"
                        />
                      </Link>
                      
                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert('Added to wishlist!');
                        }}
                        className="absolute bottom-0 right-0 mr-2 mb-2 bg-white ring-1 ring-inset ring-neutral-200 rounded-full p-2 hover:bg-gray-50 transition-colors"
                        aria-label="Add to wishlist"
                      >
                        <i className="fa fa-heart text-gray-700" aria-hidden="true"></i>
                      </button>

                      {/* Discount Badge */}
                      {product.discount > 0 && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                          -{product.discount}%
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 text-center">
                      {/* Product Title */}
                      <Link
                        to={`/products/${product._id}`}
                        className="text-gray-800 hover:text-gray-900 font-medium no-underline block mb-1"
                      >
                        {product.title}
                      </Link>

                      {/* Product Code */}
                      {/* <p className="text-sm text-gray-600 mb-2">
                        Code: {product.sku || product._id.slice(-8).toUpperCase()}
                      </p> */}

                      {/* Price */}
                      <div className="pb-2">
                        {product.discount > 0 ? (
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-lg font-bold text-gray-800">
                              ₹{(product.price * (1 - product.discount / 100)).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="block font-bold text-lg text-gray-800">₹{product.price?.toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
