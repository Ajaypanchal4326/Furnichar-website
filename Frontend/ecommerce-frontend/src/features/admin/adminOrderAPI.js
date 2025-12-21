import axiosInstance from "../../services/axiosInstance";

export const fetchOrdersAPI = async () => {
  const res = await axiosInstance.get("/orders");
  return res.data;
};

export const updateOrderAPI = async (id, status) => {
  const res = await axiosInstance.put(`/orders/${id}`, { status });
  return res.data;
};
