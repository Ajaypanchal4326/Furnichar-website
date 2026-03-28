import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosInstance";

const readStoredUser = () => {
  const token = localStorage.getItem("token");
  const rawUser = localStorage.getItem("user");

  if (!token || token === "null" || token === "undefined" || !rawUser) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }
};

/* ================= REGISTER – SEND OTP ================= */
export const registerRequest = createAsyncThunk(
  "auth/register-request",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register-request", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "OTP send failed"
      );
    }
  }
);

/* ================= REGISTER – VERIFY OTP ================= */
export const registerVerify = createAsyncThunk(
  "auth/register-verify",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/register-verify", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

export const resendOtp = createAsyncThunk(
  "auth/resend-otp",
  async (email, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/resend-otp", { email });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Resend failed"
      );
    }
  }
);


/* ================= LOGIN ================= */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/login", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: readStoredUser(),
    loading: false,
    error: null,
    otpSent: false,
  },
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    resetOtp(state) {
      state.otpSent = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER REQUEST
      .addCase(registerRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerRequest.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
      })
      .addCase(registerRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER VERIFY
      .addCase(registerVerify.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerVerify.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.otpSent = false;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerVerify.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, resetOtp } = authSlice.actions;
export default authSlice.reducer;
