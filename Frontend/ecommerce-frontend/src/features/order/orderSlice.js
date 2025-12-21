import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createOrderAPI, fetchMyOrdersAPI } from "./orderAPI";

export const createOrder = createAsyncThunk(
  "order/create",
  async (orderData) => {
    return await createOrderAPI(orderData);
  }
);

export const fetchMyOrders = createAsyncThunk(
  "order/myOrders",
  async () => {
    return await fetchMyOrdersAPI();
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  },
});

export default orderSlice.reducer;
