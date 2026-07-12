import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function Logout() {
  useEffect(() => {
    localStorage.removeItem("edtech_crm_demo_auth");
  }, []);

  return <Navigate to="/login" replace />;
}
