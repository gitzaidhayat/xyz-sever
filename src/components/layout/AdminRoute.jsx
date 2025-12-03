import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../common/Loader';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading, initialCheckComplete } = useSelector((state) => state.auth);

  // Show loader while checking authentication status
  if (!initialCheckComplete || isLoading) {
    return <Loader />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  // Check if user has admin/clothPartner role
  const allowedRoles = ['admin', 'clothPartner'];
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
