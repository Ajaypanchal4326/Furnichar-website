import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchOrdersAPI, updateOrderAPI } from "./adminOrderAPI";

export const fetchOrders = createAsyncThunk("admin/fetchOrders", fetchOrdersAPI);

export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrder",
  async ({ id, status }) => updateOrderAPI(id, status)
);

const adminOrderSlice = createSlice({
  name: "adminOrder",
  initialState: { orders: [] },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.orders = state.orders.map((o) =>
          o._id === action.payload._id ? action.payload : o
        );
      });
  },
});

export default adminOrderSlice.reducer;
