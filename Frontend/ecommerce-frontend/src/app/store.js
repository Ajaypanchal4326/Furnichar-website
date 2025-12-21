import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import productReducer from "../features/product/productSlice";
import orderReducer from "../features/order/orderSlice";
import adminProductReducer from "../features/admin/adminProductSlice";

import adminOrderReducer from "../features/admin/adminOrderSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
    adminProduct: adminProductReducer,
    adminOrder: adminOrderReducer, 
  },
});

export default store;
