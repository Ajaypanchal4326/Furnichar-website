import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";

export default function AdminDashboard() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    if (user.role !== "admin") {
      setError("You don't have admin access");
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const { data } = await axiosInstance.get("/admin/analytics");

        if (!data?.stats || !Array.isArray(data?.recentOrders)) {
          throw new Error("Invalid analytics response");
        }

        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      } catch (err) {
        console.error("Analytics error:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          setError("Session expired. Please login again.");
          setTimeout(() => navigate("/login"), 2000);
        } else if (err.response?.status === 403) {
          setError("Admin access required");
        } else {
          setError("Failed to load admin analytics");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 px-4">
        <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin"></div>
        <p className="mt-5 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 px-4">
        <div className="text-6xl mb-4">⚠</div>
        <p className="text-lg text-red-500 dark:text-red-400 font-medium text-center">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 px-4">
        <p className="text-lg text-red-500 dark:text-red-400 font-medium text-center">Analytics data unavailable</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white tracking-tight mb-1">
              Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Welcome back, {user?.name}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 shadow-sm text-center">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          <StatCard 
            title="Total Products" 
            value={stats.totalProducts}
            icon="📦"
          />
          <StatCard 
            title="Total Orders" 
            value={stats.totalOrders}
            icon="🛍️"
          />
          <StatCard 
            title="Total Revenue" 
            value={`₹${stats.totalRevenue.toLocaleString("en-IN")}`}
            icon="💰"
            highlight={true}
          />
          <StatCard 
            title="Total Customers" 
            value={stats.totalCustomers}
            icon="👥"
          />
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700 shadow-md">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b-2 border-gray-100 dark:border-gray-700 gap-2">
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-black dark:text-white">Recent Orders</h2>
            <span className="bg-black dark:bg-white text-white dark:text-black px-3 py-1 rounded-full text-xs sm:text-sm font-semibold w-fit">
              {recentOrders.length} orders
            </span>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="text-5xl sm:text-6xl mb-4 opacity-30">📋</div>
              <p className="text-sm sm:text-base text-gray-400 dark:text-gray-500">No recent orders</p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900">
                    <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide border-y border-gray-200 dark:border-gray-700 whitespace-nowrap">
                      Order ID
                    </th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide border-y border-gray-200 dark:border-gray-700 whitespace-nowrap">
                      Customer
                    </th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide border-y border-gray-200 dark:border-gray-700 whitespace-nowrap">
                      Amount
                    </th>
                    <th className="px-3 sm:px-4 lg:px-6 py-3 text-left text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide border-y border-gray-200 dark:border-gray-700 whitespace-nowrap">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {recentOrders.map((order, index) => (
                    <tr 
                      key={order._id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      style={{
                        animation: `fadeIn 0.3s ease ${index * 0.05}s both`
                      }}
                    >
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="font-mono text-[10px] sm:text-xs font-semibold text-black dark:text-white bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded inline-block">
                          #{order._id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-black to-gray-700 dark:from-gray-600 dark:to-gray-400 text-white dark:text-black flex items-center justify-center text-[10px] sm:text-xs font-semibold flex-shrink-0">
                            {(order.user?.name || "G").charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-black dark:text-white text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none">
                            {order.user?.name || "Guest"}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="text-xs sm:text-sm lg:text-base font-bold text-black dark:text-white">
                          ₹{order.totalPrice.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 whitespace-nowrap">
                        <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: '2-digit'
                          })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

/* ===============================
   STAT CARD COMPONENT
================================ */
function StatCard({ title, value, icon, highlight }) {
  return (
    <div className={`
      ${highlight 
        ? 'bg-gradient-to-br from-black to-gray-800 dark:from-gray-700 dark:to-gray-900 text-white shadow-xl' 
        : 'bg-white dark:bg-gray-800 text-black dark:text-white shadow-md hover:shadow-lg'
      }
      rounded-lg sm:rounded-xl lg:rounded-2xl p-4 sm:p-5 lg:p-6 border border-gray-200 dark:border-gray-700
      transition-all duration-300 cursor-pointer
      hover:-translate-y-1
      flex items-center gap-3 sm:gap-4
      w-full
    `}>
      <div className={`
        text-xl sm:text-2xl lg:text-3xl w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-lg sm:rounded-xl flex-shrink-0
        ${highlight ? 'bg-white/10 dark:bg-white/10' : 'bg-gray-100 dark:bg-gray-700'}
      `}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`
          text-[10px] sm:text-xs font-semibold uppercase tracking-wide mb-1
          ${highlight ? 'text-gray-300 dark:text-gray-400' : 'text-gray-600 dark:text-gray-400'}
        `}>
          {title}
        </p>
        <h3 className={`
          text-xl sm:text-2xl lg:text-3xl font-bold truncate
          ${highlight ? 'text-white' : 'text-black dark:text-white'}
        `}>
          {value}
        </h3>
      </div>
    </div>
  );
}
