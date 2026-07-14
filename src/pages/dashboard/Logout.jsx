import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { logout } from "../../services/authService.js";

export default function Logout() {
  useEffect(() => {
    logout();
  }, []);

  return <Navigate to="/login" replace />;
}
