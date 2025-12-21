import { Link, useLocation } from "react-router-dom";

export default function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();

  const menuItems = [
    { path: "/admin/dashboard", label: "Dashboard" },
    { path: "/admin/add-product", label: "Add Product" },
    { path: "/admin/products", label: "Manage Products" },
    { path: "/admin/orders", label: "Orders" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: isOpen ? 0 : "-280px",
        width: "280px",
        height: "100vh",
        background: "#111",
        color: "#fff",
        padding: "20px",
        transition: "left 0.3s ease",
        zIndex: 999,
        overflowY: "auto",
        boxShadow: isOpen ? "2px 0 10px rgba(0,0,0,0.3)" : "none",
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
        <h3 style={{ margin: 0 }}>Admin Panel</h3>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
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
                color: "#fff",
                textDecoration: "none",
                padding: "12px 15px",
                marginBottom: "8px",
                borderRadius: "6px",
                backgroundColor: isActive ? "#333" : "transparent",
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.target.style.backgroundColor = "#222";
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