import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../features/order/orderSlice";

export default function MyOrders() {
  const dispatch = useDispatch();
  const { orders = [], loading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
      processing: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      shipped: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
      delivered: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
      cancelled: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
    };
    return statusColors[status?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600";
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "processing":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case "shipped":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        );
      case "delivered":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "cancelled":
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 dark:border-gray-600 border-t-gray-900 dark:border-t-white mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">My Orders</h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage your orders</p>
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-lg">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No orders yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Start shopping to see your orders here</p>
            <a
              href="/"
              className="inline-block bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-700 dark:to-gray-600 text-white px-8 py-3 rounded-xl font-medium hover:from-gray-800 hover:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-200 shadow-lg"
            >
              Start Shopping
            </a>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4 sm:space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl dark:shadow-gray-900/50 transition-shadow duration-300 overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Order ID</p>
                      <p className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className="hidden sm:block w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Order Date</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border ${getStatusColor(
                        order.orderStatus
                      )}`}
                    >
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-4 sm:p-6">
                <div className="space-y-3">
                  {order.orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                    >
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                          {item.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <span className="text-gray-500 dark:text-gray-400">Qty:</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{item.quantity}</span>
                          </span>
                          <span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>
                          <span className="flex items-center gap-1">
                            <span className="text-gray-500 dark:text-gray-400">Price:</span>
                            <span className="font-semibold text-gray-900 dark:text-white">₹{item.price}</span>
                          </span>
                          <span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>
                          <span className="flex items-center gap-1">
                            <span className="text-gray-500 dark:text-gray-400">Subtotal:</span>
                            <span className="font-bold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping Address & Total Section */}
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  {/* Shipping Address */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">Delivery Address</h3>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 text-sm">
                      <p className="text-gray-900 dark:text-white font-medium mb-2">
                        {order.shippingAddress.address}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">{order.shippingAddress.country}</p>
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-600">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {order.shippingAddress.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">Order Summary</h3>
                    </div>
                    <div className="bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 sm:p-6 text-white">
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300 dark:text-gray-400">Items Total</span>
                          <span className="font-semibold">
                            ₹{order.orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300 dark:text-gray-400">Shipping</span>
                          <span className="font-semibold">₹{(order.shippingPrice || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-300 dark:text-gray-400">Tax</span>
                          <span className="font-semibold">₹{(order.taxPrice || 0).toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-600 dark:border-gray-500 pt-3 mt-3">
                          <div className="flex justify-between items-center">
                            <span className="text-base sm:text-lg font-bold">Total Amount</span>
                            <span className="text-xl sm:text-2xl font-bold text-yellow-400">
                              ₹{order.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Payment Status</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.isPaid
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                          }`}
                        >
                          {order.isPaid ? "Paid" : "Pending"}
                        </span>
                      </div>
                      {order.isPaid && order.paidAt && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Paid on {new Date(order.paidAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {order.orderStatus.toLowerCase() === "delivered" && (
                  <div className="flex mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button className="w-full sm:w-auto border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-medium hover:border-gray-900 hover:text-gray-900 dark:hover:border-gray-400 dark:hover:text-white transition-all duration-200">
                      Leave Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}