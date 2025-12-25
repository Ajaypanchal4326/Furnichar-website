import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  // Detect browser theme preference
  useEffect(() => {
    const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(darkModeQuery.matches);

    const handleChange = (e) => setIsDark(e.matches);
    darkModeQuery.addEventListener("change", handleChange);

    return () => darkModeQuery.removeEventListener("change", handleChange);
  }, []);

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/add-product", label: "Add Product" },
    { path: "/admin/products", label: "Manage Products" },
    { path: "/admin/orders", label: "Orders" },
  ];

  // Theme-aware colors
  const bgColor = isDark ? "#1a1a1a" : "#f5f5f5";
  const textColor = isDark ? "#ffffff" : "#000000";
  const activeBg = isDark ? "#333333" : "#e0e0e0";
  const hoverBg = isDark ? "#2a2a2a" : "#e8e8e8";

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: isOpen ? 0 : "-280px",
        width: "280px",
        height: "100vh",
        background: bgColor,
        color: textColor,
        padding: "20px",
        transition: "left 0.3s ease",
        zIndex: 999,
        overflowY: "auto",
        boxShadow: isOpen ? `2px 0 10px rgba(0,0,0,${isDark ? "0.5" : "0.3"})` : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ margin: 0, color: textColor }}>Admin Panel</h3>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: textColor,
            fontSize: "24px",
            cursor: "pointer",
            padding: "5px",
            lineHeight: 1,
          }}
          aria-label="Close menu"
        >
          ×
        </button>
      </div>

      <nav>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              style={{
                display: "block",
                color: textColor,
                textDecoration: "none",
                padding: "12px 15px",
                marginBottom: "8px",
                borderRadius: "6px",
                backgroundColor: isActive ? activeBg : "transparent",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.target.style.backgroundColor = hoverBg;
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.target.style.backgroundColor = "transparent";
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}