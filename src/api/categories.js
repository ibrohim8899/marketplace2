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

export const deleteCategory = async (uid) => {
  const res = await axiosInstance.delete(`/product/categories/${uid}/delete/`);
  return res.data;
};

export const updateCategory = async (uid, body) => {
  const res = await axiosInstance.put(`/product/categories/${uid}/update/`, body);
  return res.data;
};

export const partialUpdateCategory = async (uid, body) => {
  const res = await axiosInstance.patch(`/product/categories/${uid}/update/`, body);
  return res.data;
};
