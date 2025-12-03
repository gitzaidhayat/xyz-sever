import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { BsFillLightningChargeFill } from "react-icons/bs";
import { fetchProductById, fetchProducts } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/common/Loader';
import ProductCard from '../components/product/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct: product, products, isLoading } = useSelector((state) => state.products);
  const { isAuthenticated } = useAuth();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');

  // Scroll to top when component mounts or ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    dispatch(fetchProductById(id));
    dispatch(fetchProducts({ limit: 4 })); // Fetch similar products
  }, [id, dispatch]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setSelectedImage(0);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    try {
      await dispatch(addToCart({ 
        productId: product._id, 
        quantity: 1, 
        variant: selectedSize,
        product: product
      })).unwrap();
      alert('Product added to cart successfully!');
    } catch (error) {
      alert(error || 'Failed to add product to cart');
    }
  };

  const handleAddToWishlist = () => {
    alert('Added to wishlist!');
  };

  const handleBuyNow = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      navigate(`/login?redirect=/product/${id}`);
      return;
    }

    // Check if size is selected
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    
    try {
      // Add product to cart first
      await dispatch(addToCart({ 
        productId: product._id, 
        quantity: 1, 
        variant: selectedSize,
        product: product
      })).unwrap();
      
      // Redirect to checkout page
      navigate('/checkout');
    } catch (error) {
      alert(error || 'Failed to process request');
    }
  };

  if (isLoading || !product) {
    return <Loader />;
  }

  const images = product.images?.length > 0 
    ? product.images 
    : ['https://via.placeholder.com/600x800?text=Product'];

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  // Filter similar products (excluding current product)
  const similarProducts = products.filter(p => p._id !== product._id).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-5 ">
            <div className="bg-white rounded-lg overflow-hidden">
              {/* Product Code Badge */}
              {/* <div className="bg-gray-700 text-white px-4 py-2 text-sm font-medium">
                Product code : {product.sku || 'HWLHS9'}
              </div> */}

              {/* Main Image */}
              <div className="relative bg-gray-100 p-8">
                <img
                  src={images[selectedImage]}
                  alt={product.title || product.name}
                  className="w-full h-[500px] object-contain"
                />
              </div>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <div className="flex gap-2 p-2 border-t">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-1 border-2 rounded overflow-hidden transition-all ${
                        selectedImage === index 
                          ? 'border-teal-500' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg p-6 space-y-6">
              {/* Collection Tag */}
              <div className='flex justify-between'>
                <div className="text-xs text-teal-600 font-semibold uppercase tracking-wide">
                {product.category || 'MINIMAL WOMEN COLLECTION'}
              </div>
              <button
                  onClick={handleAddToWishlist}
                  className="flex items-center justify-center gap-2   hover:border-teal-500 hover:text-teal-500 transition-colors"
                >
                  <FiHeart size={20} />
                  <span className="font-medium">WISHLIST</span>
                </button>
              </div>

              {/* Product Title */}
              <h1 className="text-3xl font-semibold text-gray-800">
                {product.title || product.name}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                {product.comparePrice && (
                  <span className="text-lg text-gray-400 line-through">
                    ₹{product.comparePrice.toFixed(2)}
                  </span>
                )}
                <span className="text-4xl font-bold text-gray-900">
                  ₹{product.price?.toFixed(2) || '40'}
                </span>
              </div>

              {/* Tax Info */}
              <p className="text-sm text-gray-500 italic">
                *price inclusive of all taxes
              </p>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-800 uppercase">Select Size</span>
                  <button className="text-sm text-teal-600 hover:underline">Size Chart</button>
                </div>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-14 h-12 rounded-full border-2 font-medium transition-all ${
                        selectedSize === size
                          ? 'border-teal-500 bg-teal-500 text-white'
                          : 'border-gray-300 text-gray-700 hover:border-teal-500'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleBuyNow}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded transition-colors"
                >
                  <BsFillLightningChargeFill size={20} />
                  <span className="font-medium">Buy Now</span>
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded transition-colors"
                >
                  <FiShoppingCart size={20} />
                  <span>ADD TO CART</span>
                </button>
              </div>

              {/* Product Details Section */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-800 mb-3 uppercase">Product Details</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description || 'NA'}
                </p>
              </div>

              {/* Material & Care */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-800 mb-3 uppercase">Material & Care</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{product.material || 'Cotton'}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Machine-wash</span>
                  </li>
                </ul>
              </div>

              {/* Sold By */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-800 mb-3 uppercase">Sold By</h3>
                <div className="text-teal-600 font-medium mb-2">
                  {product.seller || 'Wend N Store, Stillwater'}
                </div>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• 90% Positive Feedback</li>
                  <li>• All Products</li>
                  <li>• All Products come with 2 months Warranty</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map((similarProduct) => (
                <ProductCard key={similarProduct._id} product={similarProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
