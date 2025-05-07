import { ReactElement, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import SpinnerLoading from '../components/SpinnerLoading';

const ProtectedRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated, token, isLoading, loadUser, socket, connectSocket } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (token && !isAuthenticated && !isLoading) {
      loadUser();
    }
    if (isAuthenticated && !socket) {
        connectSocket(); // Socket mất thì connect lại
      }
  }, [token, isAuthenticated, isLoading, loadUser, socket, connectSocket]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-200">
        <SpinnerLoading />
      </div>
    );
  }

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
