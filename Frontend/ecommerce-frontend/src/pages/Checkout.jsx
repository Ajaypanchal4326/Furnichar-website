import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../features/order/orderSlice";

export default function Checkout() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const placeOrder = () => {
    dispatch(
      createOrder({
        orderItems: items.map((i) => ({
          product: i._id,
          name: i.title,
          price: i.price,
          quantity: i.quantity,
        })),
        paymentMethod: "COD",
        totalPrice: items.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        ),
      })
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      <button onClick={placeOrder}
        className="bg-black text-white px-6 py-3 rounded">
        Place Order
      </button>
    </div>
  );
}
