import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import Footer from './Footer';
import ProfilePage from '../../pages/ProfilePage';
import AdminDashboard from '../../pages/admin/AdminDashboard';
import Loader from '../common/Loader';

const ProfileRouter = () => {
  const { user, isAuthenticated, isLoading, initialCheckComplete } = useSelector((state) => state.auth);

  console.log('=== ProfileRouter Debug ===');
  console.log('Auth state:', { user, isAuthenticated, isLoading, initialCheckComplete });
  console.log('User role:', user?.role);
  console.log('User email:', user?.email);
  console.log('User ID:', user?._id);

  // If we have user and isAuthenticated, proceed regardless of initialCheckComplete
  // This handles the case where localStorage has auth but loadUser hasn't run yet
  if (user && isAuthenticated) {
    console.log('✅ User is authenticated, proceeding...');
    // Continue to role-based routing below
  } else {
    // Show loader while checking auth (only if initialCheckComplete is false)
    if (!initialCheckComplete) {
      console.log('⏳ Showing loader - waiting for auth check');
      return <Loader />;
    }
    
    // If check is complete and still no auth, redirect to login
    console.log('❌ Redirecting to login - Not authenticated');
    console.log('isAuthenticated:', isAuthenticated, 'user:', !!user);
    return <Navigate to="/login" replace />;
  }

  // Check if user is admin - check role field or if they have username (admin-specific field)
  const isAdmin = user.role === 'admin' || (user.username && user.phone);
  
  if (isAdmin) {
    console.log('ProfileRouter - Admin detected (role or admin-specific fields), rendering AdminDashboard');
    return <AdminDashboard />;
  }

  console.log('ProfileRouter - Regular user, rendering ProfilePage');
  // Regular user - show user profile
  return (
    <>
      <Navbar />
      <ProfilePage />
      <Footer />
    </>
  );
};

export default ProfileRouter;
