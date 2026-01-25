import { useSelector } from "react-redux";

export default function Checkout() {
  const { items } = useSelector((state) => state.cart);

  const comingSoon = () => {
    alert("🚧 Checkout feature is coming soon!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 sm:p-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Checkout
          </h2>

          <button
            onClick={comingSoon}
            className="px-8 py-3 rounded-xl bg-gray-700 dark:bg-gray-600 text-white font-medium hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors duration-200 cursor-pointer"
          >
            Coming Soon
          </button>

          <p className="text-sm mt-4 text-gray-600 dark:text-gray-400">
            Payment & order placement will be available soon.
          </p>

          {/* Optional: Show cart summary */}
          {items.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Cart Summary
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// import { useDispatch, useSelector } from "react-redux";
// import { createOrder } from "../features/order/orderSlice";

// export default function Checkout() {
//   const dispatch = useDispatch();
//   const { items } = useSelector((state) => state.cart);

//   const placeOrder = () => {
//     dispatch(
//       createOrder({
//         orderItems: items.map((i) => ({
//           product: i._id,
//           name: i.title,
//           price: i.price,
//           quantity: i.quantity,
//         })),
//         paymentMethod: "COD",
//         totalPrice: items.reduce(
//           (sum, i) => sum + i.price * i.quantity,
//           0
//         ),
//       })
//     );
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h2 className="text-2xl font-bold mb-4">Checkout</h2>
//       <button onClick={placeOrder}
//         className="bg-black text-white px-6 py-3 rounded">
//         Place Order
//       </button>
//     </div>
//   );
// }
