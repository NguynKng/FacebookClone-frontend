import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import SpinnerLoading from '../components/SpinnerLoading';

const AuthRoute = ({ children }: { children: ReactElement }) => {
  const { isAuthenticated, token, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <SpinnerLoading />
      </div>
    );
  }

  if (token || isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AuthRoute;