import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
