import axiosInstance from "../../services/axiosInstance";

export const createProductAPI = async (productData) => {
  const res = await axiosInstance.post("/products", productData);
  return res.data;
};

export const fetchAdminProductsAPI = async () => {
  const res = await axiosInstance.get("/products");
  return res.data;
};

export const deleteProductAPI = async (id) => {
  const res = await axiosInstance.delete(`/products/${id}`);
  return res.data;
};

export const updateProductAPI = async (id, productData) => {
  const res = await axiosInstance.put(`/products/${id}`, productData);
  return res.data;
};
