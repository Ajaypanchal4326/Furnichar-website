import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");
  const hasToken = Boolean(token && token !== "null" && token !== "undefined");

  if (!user || !hasToken) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}
