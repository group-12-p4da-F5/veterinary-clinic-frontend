import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export function PrivateRoute() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

export function PublicRoute() {
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}
