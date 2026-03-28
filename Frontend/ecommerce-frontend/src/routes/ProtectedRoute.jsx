import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");
  const hasToken = Boolean(token && token !== "null" && token !== "undefined");

  return user && hasToken ? children : <Navigate to="/login" />;
}
