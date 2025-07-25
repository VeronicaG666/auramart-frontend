import { Navigate } from "react-router-dom";
import { useUser } from "context/UserContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;
