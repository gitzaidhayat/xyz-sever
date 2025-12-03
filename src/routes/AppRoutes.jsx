import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import AdminRoute from '../components/layout/AdminRoute';
import ProfileRouter from '../components/layout/ProfileRouter';

// Public Pages
import HomePage from '../pages/HomePage';
import ProductListPage from '../pages/ProductListPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import LoginPage from '../pages/Auth/LoginPage';
import RegisterPage from '../pages/Auth/RegisterPage';
import AdminLoginPage from '../pages/Auth/AdminLoginPage';
import AdminRegisterPage from '../pages/Auth/AdminRegisterPage';
import AboutUs from '../pages/AboutUs';
import ContactUs from '../pages/ContactUs';
import Blog from '../pages/Blog';
import SizeChart from '../pages/SizeChart';
import Feedback from '../pages/Feedback';

// Protected User Pages
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrdersPage from '../pages/OrdersPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import ProfilePage from '../pages/ProfilePage';
import WishlistPage from '../pages/Wishlist';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminProductVideo from '../pages/admin/AdminProductVideo';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminCouponsPage from '../pages/admin/AdminCouponsPage';
import AdminProfilePage from '../pages/admin/AdminProfilePage';
import AdminSetting from '../pages/admin/AdminSetting';
import AdminCreateOrderPage from '../pages/admin/AdminCreateOrderPage';
import AdminSendNews from '../pages/admin/AdminSendNews';
import Topstripe from '../components/layout/Topstripe';
import Herostripe from '../components/layout/Herostripe';

const AppRoutes = () => {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <>
              <Topstripe />
              <Navbar />
              <Herostripe />
              <HomePage />
              <Footer />
            </>
          }
        />
        <Route
          path="/products"
          element={
            <>
              <Navbar />
              <ProductListPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/products/:id"
          element={
            <>
              <Navbar />
              <ProductDetailPage />
              <Footer />
            </>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/register" element={<AdminRegisterPage />} />

        {/* Information Pages */}
        <Route
          path="/about-us"
          element={
            <>
              <Navbar />
              <AboutUs />
              <Footer />
            </>
          }
        />
        <Route
          path="/contact-us"
          element={
            <>
              <Navbar />
              <ContactUs />
              <Footer />
            </>
          }
        />
        <Route
          path="/blog"
          element={
            <>
              <Navbar />
              <Blog />
              <Footer />
            </>
          }
        />
        <Route
          path="/size-chart"
          element={
            <>
              <Navbar />
              <SizeChart />
              <Footer />
            </>
          }
        />
        <Route
          path="/feedback"
          element={
            <>
              <Navbar />
              <Feedback />
              <Footer />
            </>
          }
        />

        {/* Protected User Routes */}
        <Route
          path="/cart"
          element={
            <>
              <Navbar />
              <CartPage />
              <Footer />
            </>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Navbar />
              <CheckoutPage />
              <Footer />
            </ProtectedRoute>
          }
        />
        {/* Profile Route - Role-based routing */}
        <Route path="/profile" element={<ProfileRouter />} />
        
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Navbar />
              <OrdersPage />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <Navbar />
              <OrderDetailPage />
              <Footer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Navbar />
              <WishlistPage />
              <Footer />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminRoute>
              <AdminProfilePage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProductsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/product-videos"
          element={
            <AdminRoute>
              <AdminProductVideo />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrdersPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders/create"
          element={
            <AdminRoute>
              <AdminCreateOrderPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/coupons"
          element={
            <AdminRoute>
              <AdminCouponsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/setting"
          element={
            <AdminRoute>
              <AdminSetting />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/send-news"
          element={
            <AdminRoute>
              <AdminSendNews />
            </AdminRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <div className="min-h-screen bg-[#f5e9da] flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-[#1f2933] mb-4 font-['Playfair_Display']">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Page not found</p>
                  <a href="/" className="px-8 py-3 bg-[#d5a437] text-white rounded-full font-medium hover:bg-[#e0b54d]">
                    Go Home
                  </a>
                </div>
              </div>
              <Footer />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
