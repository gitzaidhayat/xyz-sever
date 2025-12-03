import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FiSearch,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { logout } from "../../store/slices/authSlice";
import { PiShoppingCartSimpleThin } from "react-icons/pi";
import { CiHeart } from "react-icons/ci";
import { CiUser } from "react-icons/ci";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNavbar, setShowNavbar] = useState(true);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const lastScrollY = useRef(0);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);

  // Check if we're on profile or admin dashboard page
  const isOnProfilePage = location.pathname === '/profile' || 
                          location.pathname === '/admin/dashboard' ||
                          location.pathname.startsWith('/admin/');

  // Debug: Log auth state
  useEffect(() => {
    
  }, [isAuthenticated, user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowUserDropdown(false);
    alert('Logout successful!');
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Categories", path: "/products?category=all" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav
      className={`bg-[#ffff] shadow-md sticky top-0 z-50 h-[60px] transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        {/* MAIN FLEX: LEFT (logo) – CENTER (search) – RIGHT (auth + cart + menu) */}
        <div className="flex items-center justify-between h-13 gap-6">
          {/* LEFT: Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="">
              <img src="https://ik.imagekit.io/j90xpcrfe/Abaya_wholesale_white_logo.png" alt="Abaya Logo" className="w-[130px] h-[50px] bg-[#02333a] opacity-90 rounded-tl-4xl rounded-br-4xl rounded-tr-lg mt-1" />
            </div>
            
          </Link>

          {/* CENTER: Search bar (desktop / tablet) */}
          <div className="flex-1 hidden md:flex justify-center">
            <form
              onSubmit={handleSearch}
              className="flex items-center w-full max-w-md"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search abayas..."
                  className="bg-gray-100 w-full px-4 py-2 pr-10  border-[#a68886]/20 focus:outline-none  transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a463e]"
                >
                  <FiSearch size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: Icon group (responsive) */}
          <div
            className={`flex items-center gap-2 xs:gap-3 sm:gap-4 lg:gap-5 shrink-0 transition-all duration-300
              ${!showNavbar ? 'opacity-0 pointer-events-none -translate-y-2' : 'opacity-100'}
              ${isMenuOpen ? 'md:opacity-100 md:pointer-events-auto' : ''}`}
          >
            {/* Wishlist - Only show for regular users */}
            {(!isAuthenticated || user?.role !== 'admin') && (
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="flex items-center justify-center h-10 w-10 rounded-full text-[#1f2933] hover:text-[#d5a437] hover:bg-[#d5a437]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d5a437] active:scale-95 transition-all duration-200"
              >
                <CiHeart className="h-5 w-5 md:h-6 md:w-6" />
              </Link>
            )}
            {/* Account / Login - Navigate based on auth status */}
            <div 
              className="relative" 
              ref={dropdownRef}
              onMouseEnter={() => isAuthenticated && setShowUserDropdown(true)}
              onMouseLeave={() => setShowUserDropdown(false)}
            >
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    navigate(user?.role === 'admin' ? "/admin/dashboard" : "/profile");
                  } else {
                    navigate("/login");
                  }
                }}
                aria-label="Account"
                className="flex items-center justify-center h-10 w-10 rounded-full text-[#1f2933] hover:text-[#d5a437] hover:bg-[#d5a437]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d5a437] active:scale-95 transition-all duration-200"
              >
                <CiUser className="h-5 w-5 md:h-6 md:w-6" />
              </button>

              {/* User Dropdown */}
              {isAuthenticated && showUserDropdown && (
                <div className="absolute right-0 mt-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {!isOnProfilePage && (
                    <button
                      onClick={() => {
                        navigate(user?.role === 'admin' ? "/admin/dashboard" : "/profile");
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#1f2933] hover:bg-[#d5a437]/10 hover:text-[#d5a437] transition-colors"
                    >
                      Profile
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-[#1f2933] hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            {/* Cart - Only show for regular users */}
            {(!isAuthenticated || user?.role !== 'admin') && (
              <Link
                to="/cart"
                aria-label="Cart"
                className="relative flex items-center justify-center h-8 w-8 rounded-full text-[#1f2933] hover:text-[#d5a437] hover:bg-[#d5a437]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d5a437] transition-colors"
              >
                <PiShoppingCartSimpleThin className="h-5 w-5 md:h-6 md:w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#d5a437] text-white text-[10px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center leading-none">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation"
              className="flex md:hidden items-center justify-center h-10 w-10 rounded-full text-[#1f2933] hover:text-[#d5a437] hover:bg-[#d5a437]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d5a437] transition-colors"
            >
              {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
          
        </div> 

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#d5a437]/20">
            {/* Mobile Search (full width) */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search abayas..."
                  className="w-full px-4 py-2 pr-10 rounded-full bg-white border border-[#d5a437]/20 focus:outline-none focus:border-[#d5a437]"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#d5a437]"
                >
                  <FiSearch size={20} />
                </button>
              </div>
            </form>

            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-[#1f2933] hover:text-[#d5a437] font-medium py-2 transition-colors"
                >
                  {link.name}
                </Link>
              ))}

              {isAuthenticated ? (
                <>
                  {/* Show different menu items based on user role */}
                  {user?.role === 'admin' ? (
                    // Admin menu items
                    <>
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-[#1f2933] hover:text-[#d5a437] font-medium py-2 transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                      <Link
                        to="/admin/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-[#1f2933] hover:text-[#d5a437] font-medium py-2 transition-colors"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/admin/products"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-[#1f2933] hover:text-[#d5a437] font-medium py-2 transition-colors"
                      >
                        Products
                      </Link>
                      <Link
                        to="/admin/orders"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-[#1f2933] hover:text-[#d5a437] font-medium py-2 transition-colors"
                      >
                        Orders
                      </Link>
                      <Link
                        to="/admin/users"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-[#1f2933] hover:text-[#d5a437] font-medium py-2 transition-colors"
                      >
                        Users
                      </Link>
                      <Link
                        to="/admin/coupons"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-[#1f2933] hover:text-[#d5a437] font-medium py-2 transition-colors"
                      >
                        Coupons
                      </Link>
                    </>
                  ) : (
                    // User menu items
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-[#1f2933] hover:text-[#d5a437] font-medium py-2 transition-colors"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-[#1f2933] hover:text-[#d5a437] font-medium py-2 transition-colors"
                      >
                        Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-[#1f2933] hover:text-[#d5a437] font-medium py-2 transition-colors"
                      >
                        Wishlist
                      </Link>
                      <Link
                        to="/cart"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-[#1f2933] hover:text-[#d5a437] font-medium py-2 transition-colors"
                      >
                        Cart
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-[#1f2933] hover:text-[#d5a437] font-medium py-2 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-[#1f2933] hover:text-[#d5a437] font-medium py-2 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="inline-block text-center px-6 py-2 bg-[#d5a437] text-white rounded-full font-medium hover:bg-[#e0b54d] transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
