import { Navigate } from "react-router-dom";

/**
 * ProtectedRoute — wraps admin routes.
 * If the user is not logged in as admin, redirects to /admin-login.
 */
function ProtectedRoute({ children }) {
  const isAdminLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";

  if (!isAdminLoggedIn) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}

export default ProtectedRoute;
