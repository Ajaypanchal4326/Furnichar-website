import { Outlet } from "react-router-dom";
import { useState, createContext, useEffect } from "react";
import AdminSidebar from "../admin/AdminSidebar";

export const AdminLayoutContext = createContext(null);

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Keep admin layout synced with app-wide theme class and saved preference.
  useEffect(() => {
    const readTheme = () => {
      const savedTheme = localStorage.getItem("theme");

      if (savedTheme) {
        return savedTheme === "dark";
      }

      return document.documentElement.classList.contains("dark");
    };

    setIsDark(readTheme());

    const root = document.documentElement;
    const observer = new MutationObserver(() => {
      setIsDark(root.classList.contains("dark"));
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    const handleStorage = (event) => {
      if (event.key === "theme") {
        setIsDark(event.newValue === "dark");
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Theme-aware colors
  const headerBg = isDark ? "#1a1a1a" : "#f8f9fa";
  const headerBorder = isDark ? "#333333" : "#dee2e6";
  const mainBg = isDark ? "#0a0a0a" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#000000";
  const barColor = isDark ? "#ffffff" : "#333333";

  return (
    <AdminLayoutContext.Provider value={{ toggleSidebar }}>
      <div style={{ display: "flex", minHeight: "100vh", position: "relative", backgroundColor: mainBg }}>
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
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Header */}
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 997,
              padding: "15px 20px",
              backgroundColor: headerBg,
              borderBottom: `1px solid ${headerBorder}`,
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
              aria-label="Toggle menu"
            >
              <span style={{ ...barStyle, backgroundColor: barColor }} />
              <span style={{ ...barStyle, backgroundColor: barColor }} />
              <span style={{ ...barStyle, backgroundColor: barColor }} />
            </button>

            <h2 style={{ margin: 0, color: textColor }}>Admin Panel</h2>
          </div>

          <div style={{ padding: "16px", backgroundColor: mainBg, minHeight: "calc(100vh - 61px)" }}>
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
  borderRadius: "2px",
};
