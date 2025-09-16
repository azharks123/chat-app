import { Navigate } from 'react-router-dom';
import { getUserToken } from '../services/auth.services';
import { CONST, handleLogout } from '../utils/constants';

const ProtectedRoute = ({ children, requiredRole='' }) => {
  const userToken = getUserToken()
  const userRole = localStorage.getItem(CONST.User_ROLE);

  if (!userToken || (requiredRole && requiredRole !== userRole)) {
    handleLogout()
  }

  return children;
};

export default ProtectedRoute;