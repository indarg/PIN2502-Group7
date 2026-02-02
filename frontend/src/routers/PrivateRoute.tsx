// authUtils.ts
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'src/context/AuthContext/useAuth';
import TransitionPage from 'src/pages/public/TransitionPage/TransitionPage';

interface PrivateRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  redirectTo = '/',
}) => {
  const location = useLocation();
  const {isAuthenticated,isValidHash,hash} = useAuth();


  if (isAuthenticated === null || isValidHash === null) {
    return <TransitionPage time={2000}/>;
  }

  if(!isValidHash){
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (!isAuthenticated && location.pathname !== `/crm/${hash}/login`) {
    return <Navigate to={`/crm/${hash}/login`} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;