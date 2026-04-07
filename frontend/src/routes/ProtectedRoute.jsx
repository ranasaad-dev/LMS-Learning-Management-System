import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a spinner or placeholder while user profile loads
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    if(localStorage.getItem("token")){
      localStorage.removeItem("token");
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;