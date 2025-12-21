import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAdminProductsAPI,
  deleteProductAPI,
  createProductAPI,
  updateProductAPI,
} from "./adminProductAPI";

/* ================= CREATE PRODUCT ================= */
export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      return await createProductAPI(formData);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Create product failed"
      );
    }
  }
);

/* ================= FETCH PRODUCTS ================= */
export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchProducts",
  async () => {
    return await fetchAdminProductsAPI();
  }
);

/* ================= DELETE PRODUCT ================= */
export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProductAPI(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Delete failed"
      );
    }
  }
);

/* ================= UPDATE PRODUCT ================= */
export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateProductAPI(id, data);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Update failed"
      );
    }
  }
);

const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState: {
    products: [],
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    resetAdminProduct(state) {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* CREATE */
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* FETCH */
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })

      /* DELETE */
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => p._id !== action.payload
        );
      })

      /* UPDATE */
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.products = state.products.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      });
  },
});

export const { resetAdminProduct } = adminProductSlice.actions;
export default adminProductSlice.reducer;
