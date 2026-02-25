import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ role, children }) => {
  const { auth } = useAuth();

  if (!auth) return <Navigate to="/" replace />;
  if (role && auth.user.role !== role) return <Navigate to={`/${auth.user.role}`} replace />;

  return children;
};

export default ProtectedRoute;
