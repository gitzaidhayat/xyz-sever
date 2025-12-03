import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../common/Loader';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, initialCheckComplete } = useSelector((state) => state.auth);

  // Show loader while checking authentication status
  if (!initialCheckComplete || isLoading) {
    return <Loader />;
  }

  // Only redirect after initial check is complete
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
