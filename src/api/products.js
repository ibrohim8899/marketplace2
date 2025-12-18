// src/api/products.js
import axiosInstance from "./axiosInstance";

// Global cache – bir marta yuklangan mahsulotlarni saqlaymiz
let cachedProducts = null;

function normalizeProductList(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.results?.products)) return data.results.products;
  return [];
}

const getAllProducts = async () => {
  if (cachedProducts) {
    console.log("Cache'dan mahsulotlar qaytarildi:", cachedProducts.length);
    return cachedProducts;
  }
  
  try {
    console.log("Mahsulotlar yuklanmoqda...");
    const res = await axiosInstance.get("/product/products/");
    console.log("Backend javobi:", res.data);
    const list = normalizeProductList(res.data);
    console.log("Normalize qilingan mahsulotlar:", list.length, list.slice(0, 2));
    cachedProducts = list; // cache ga saqlaymiz
    console.log("Mahsulotlar yuklandi va cache ga joylandi:", list.length);
    return list;
  } catch (err) {
    console.error("Mahsulotlar yuklanmadi:", err);
    console.error("Xato tafsiloti:", err.response?.data || err.message);
    return [];
  }
};

// Barcha mahsulotlarni olish
export const getProducts = async () => {
  return await getAllProducts();
};

// Kategoriya bo‘yicha
export const getProductsByCategory = async (category) => {
  if (!category || category === "all") {
    return await getAllProducts();
  }

  const res = await axiosInstance.get("/filters/products/filter/category/", {
    params: {
      category,
    },
  });

  return normalizeProductList(res.data);
};

export const filterProductsByCost = async ({ min, max, limit, offset } = {}) => {
  if (min == null || max == null) {
    return await getAllProducts();
  }

  const res = await axiosInstance.get("/filters/products/filter/price/", {
    params: {
      min,
      max,
      limit,
      offset,
    },
  });

  return normalizeProductList(res.data);
};

export const filterProductsByLocation = async ({ location, limit, offset } = {}) => {
  if (!location) {
    return await getAllProducts();
  }

  const res = await axiosInstance.get("/filters/products/filter/location/", {
    params: {
      location,
      limit,
      offset,
    },
  });

  return normalizeProductList(res.data);
};

// Qidiruv
export const searchProducts = async (query, options = {}) => {
  if (!query?.trim()) {
    return await getAllProducts();
  }

  const res = await axiosInstance.get("/filters/products/search/", {
    params: {
      query: query,  // Backend 'query' parametrini kutadi
      limit: options.limit,
      offset: options.offset,
    },
  });

  return normalizeProductList(res.data);
};

export const getMyProducts = async () => {
  const res = await axiosInstance.get("/product/my-products/");
  return normalizeProductList(res.data);
};

export const createProduct = async (body) => {
  const res = await axiosInstance.post("/product/products/create/", body);
  cachedProducts = null;
  return res.data;
};

export const getProductByUid = async (uid) => {
  if (!uid || uid === "undefined") {
    throw new Error("UID yo'q");
  }

  const res = await axiosInstance.get(`/product/products/${uid}/`);
  return res.data;
};

export const deleteProduct = async (uid) => {
  await axiosInstance.delete(`/product/products/${uid}/delete/`);
  cachedProducts = null;
};

export const updateProduct = async (uid, body) => {
  const res = await axiosInstance.put(`/product/products/${uid}/update/`, body);
  cachedProducts = null;
  return res.data;
};

export const partialUpdateProduct = async (uid, body) => {
  const res = await axiosInstance.patch(`/product/products/${uid}/update/`, body);
  cachedProducts = null;
  return res.data;
};