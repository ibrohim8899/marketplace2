import axiosInstance from "./axiosInstance";

export const getCategories = async () => {
  const res = await axiosInstance.get("/product/categories/");
  return res.data;
};

export const getCategoryById = async (uid) => {
  const res = await axiosInstance.get(`/product/categories/${uid}/`);
  return res.data;
};

export const createCategory = async (body) => {
  const res = await axiosInstance.post("/product/categories/create/", body);
  return res.data;
};
