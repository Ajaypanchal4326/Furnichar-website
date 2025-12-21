import { Outlet } from "react-router-dom";
import { useState, createContext } from "react";
import AdminSidebar from "../admin/AdminSidebar";

export const AdminLayoutContext = createContext(null);

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <AdminLayoutContext.Provider value={{ toggleSidebar }}>
      <div style={{ display: "flex", minHeight: "100vh", position: "relative" }}>
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            onClick={toggleSidebar}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 998,
            }}
          />
        )}

        {/* Sidebar */}
        <AdminSidebar isOpen={sidebarOpen} onClose={toggleSidebar} />

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          {/* Header */}
          <div
            style={{
              padding: "15px 20px",
              backgroundColor: "#f8f9fa",
              borderBottom: "1px solid #dee2e6",
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}
          >
            <button
              onClick={toggleSidebar}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span style={barStyle} />
              <span style={barStyle} />
              <span style={barStyle} />
            </button>

            <h2 style={{ margin: 0 }}>Admin Panel</h2>
          </div>

          <div style={{ padding: "20px" }}>
            <Outlet />
          </div>
        </div>
      </div>
    </AdminLayoutContext.Provider>
  );
}

const barStyle = {
  width: "24px",
  height: "3px",
  backgroundColor: "#333",
  borderRadius: "2px",
};
