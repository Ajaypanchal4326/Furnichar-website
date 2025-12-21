import axiosInstance from "../../services/axiosInstance";

export const createOrderAPI = async (orderData) => {
  const res = await axiosInstance.post("/orders", orderData);
  return res.data;
};

export const fetchMyOrdersAPI = async () => {
  const res = await axiosInstance.get("/orders/my");
  return res.data;
};
