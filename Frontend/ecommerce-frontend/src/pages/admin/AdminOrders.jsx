import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  updateOrderStatus,
} from "../../features/admin/adminOrderSlice";
import { 
  ShoppingBag, 
  User, 
  MapPin, 
  Phone, 
  Package, 
  Clock,
  Truck,
  CheckCircle,
  Search,
  Filter
} from "lucide-react";

export default function AdminOrders() {
  const dispatch = useDispatch();
  const { orders = [] } = useSelector((state) => state.adminOrder);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch(status) {
      case "processing": return <Clock size={18} className="text-yellow-600" />;
      case "shipped": return <Truck size={18} className="text-blue-600" />;
      case "delivered": return <CheckCircle size={18} className="text-green-600" />;
      default: return <Package size={18} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "processing": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "shipped": return "bg-blue-100 text-blue-800 border-blue-300";
      case "delivered": return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === "all" || order.orderStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    all: orders.length,
    processing: orders.filter(o => o.orderStatus === "processing").length,
    shipped: orders.filter(o => o.orderStatus === "shipped").length,
    delivered: orders.filter(o => o.orderStatus === "delivered").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-black text-white rounded-lg p-4 sm:p-6 mb-6 shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-2">
                <ShoppingBag size={32} />
                Manage Orders
              </h2>
              <p className="text-gray-300 text-sm sm:text-base">
                {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2 w-full lg:w-auto">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="outline-none text-black w-full lg:w-80"
              />
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={20} className="text-gray-600" />
            <span className="font-semibold text-gray-700">Filter by Status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: "All Orders", count: statusCounts.all },
              { value: "processing", label: "Processing", count: statusCounts.processing },
              { value: "shipped", label: "Shipped", count: statusCounts.shipped },
              { value: "delivered", label: "Delivered", count: statusCounts.delivered },
            ].map(({ value, label, count }) => (
              <button
                key={value}
                onClick={() => setFilterStatus(value)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filterStatus === value
                    ? "bg-black text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {label} <span className="ml-1 opacity-75">({count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm || filterStatus !== "all" ? "No orders found" : "No orders yet"}
            </h3>
            <p className="text-gray-500">
              {searchTerm || filterStatus !== "all"
                ? "Try adjusting your search or filters"
                : "Orders will appear here once customers make purchases"}
            </p>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gray-50 px-4 sm:px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order ID</p>
                    <p className="font-mono text-sm font-semibold text-gray-800">
                      #{order._id?.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${getStatusColor(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      <span className="font-semibold text-sm capitalize">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Content */}
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Customer Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <User size={18} className="text-gray-700" />
                        <h3 className="font-semibold text-gray-800">Customer Details</h3>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-700">
                          <span className="font-medium">Name:</span> {order.user?.name || "N/A"}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-medium">Email:</span> {order.user?.email || "N/A"}
                        </p>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin size={18} className="text-gray-700" />
                        <h3 className="font-semibold text-gray-800">Delivery Address</h3>
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-700">
                          {order.shippingAddress?.address || "N/A"}
                        </p>
                        <p className="text-gray-700">
                          {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}
                        </p>
                        <p className="text-gray-700">{order.shippingAddress?.country}</p>
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                          <Phone size={16} className="text-gray-600" />
                          <p className="text-gray-700 font-medium">
                            {order.shippingAddress?.phone || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Package size={18} className="text-gray-700" />
                        <h3 className="font-semibold text-gray-800">Order Items</h3>
                      </div>
                      <div className="space-y-3">
                        {order.orderItems?.map((item, i) => (
                          <div 
                            key={i} 
                            className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <p className="font-semibold text-gray-800">₹{item.price}</p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Total */}
                      <div className="mt-4 pt-4 border-t-2 border-gray-300">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                          <span className="text-xl font-bold text-black">₹{order.totalPrice}</span>
                        </div>
                      </div>
                    </div>

                    {/* Update Status */}
                    <div className="bg-black rounded-lg p-4 text-white">
                      <label className="block font-semibold mb-3">Update Order Status</label>
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          dispatch(
                            updateOrderStatus({
                              id: order._id,
                              status: e.target.value,
                            })
                          )
                        }
                        className="w-full px-4 py-3 rounded-lg text-black font-medium outline-none cursor-pointer"
                      >
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchOrders,
//   updateOrderStatus,
// } from "../../features/admin/adminOrderSlice";

// export default function AdminOrders() {
//   const dispatch = useDispatch();
//   const { orders = [] } = useSelector((state) => state.adminOrder);

//   useEffect(() => {
//     dispatch(fetchOrders());
//   }, [dispatch]);

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">Manage Orders</h2>

//       {orders.length === 0 && <p>No orders found</p>}

//       {orders.map((order) => (
//         <div
//           key={order._id}
//           className="border rounded-lg p-4 mb-6 bg-white shadow"
//         >
//           {/* USER INFO */}
//           <p><b>User:</b> {order.user?.name} ({order.user?.email})</p>

//           {/* ADDRESS */}
//           <div className="mt-2">
//             <p className="font-semibold">Delivery Address</p>
//             <p>
//               {order.shippingAddress?.address},{" "}
//               {order.shippingAddress?.city},{" "}
//               {order.shippingAddress?.postalCode},{" "}
//               {order.shippingAddress?.country}
//             </p>
//             <p>Phone: {order.shippingAddress?.phone}</p>
//           </div>

//           {/* ITEMS */}
//           <div className="mt-3">
//             <p className="font-semibold">Items</p>
//             {order.orderItems.map((item, i) => (
//               <p key={i}>
//                 {item.name} × {item.quantity} — ₹{item.price}
//               </p>
//             ))}
//           </div>

//           <p className="mt-2"><b>Total:</b> ₹{order.totalPrice}</p>

//           {/* STATUS */}
//           <div className="mt-3 flex items-center gap-3">
//             <span><b>Status:</b></span>
//             <select
//               value={order.orderStatus}
//               onChange={(e) =>
//                 dispatch(
//                   updateOrderStatus({
//                     id: order._id,
//                     status: e.target.value,
//                   })
//                 )
//               }
//               className="border px-2 py-1 rounded"
//             >
//               <option value="processing">Processing</option>
//               <option value="shipped">Shipped</option>
//               <option value="delivered">Delivered</option>
//             </select>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
