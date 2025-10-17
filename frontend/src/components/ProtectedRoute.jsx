import { useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  if (!isLoaded) return null;

  if (isSignedIn) return children;

  // Navigate to your local /login page and preserve return location
  return <Navigate to="/login" state={{ from: location }} replace />;
}
