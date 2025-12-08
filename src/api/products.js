// src/api/products.js
import axiosInstance from "./axiosInstance";

// Global cache – bir marta yuklangan mahsulotlarni saqlaymiz
let cachedProducts = null;

function normalizeProductList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.results?.products)) return data.results.products;
  return data || [];
}

const getAllProducts = async () => {
  if (cachedProducts) {
    return cachedProducts;
  }
  
  try {
    const res = await axiosInstance.get("/product/products/");
    const list = normalizeProductList(res.data);
    cachedProducts = list; // cache ga saqlaymiz
    console.log("Mahsulotlar yuklandi va cache ga joylandi:", list.length);
    return list;
  } catch (err) {
    console.error("Mahsulotlar yuklanmadi:", err);
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

export const filterProductsByCost = async ({ min, max, search, limit, offset } = {}) => {
  if (min == null || max == null) {
    return await getAllProducts();
  }

  const res = await axiosInstance.get("/filters/products/filter/cost/", {
    params: {
      min,
      max,
      search,
      limit,
      offset,
    },
  });

  return normalizeProductList(res.data);
};

export const filterProductsByLocation = async ({ location, search, limit, offset } = {}) => {
  if (!location) {
    return await getAllProducts();
  }

  const res = await axiosInstance.get("/filters/products/filter/location/", {
    params: {
      location,
      search,
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
      q: query,
      search: options.search,
      limit: options.limit,
      offset: options.offset,
    },
  });

  return normalizeProductList(res.data);
};

// BITTA MAHSULOTNI UID BO‘YICHA OLISH – 100% ISHLAYDI!
export const getProductByUid = async (uid) => {
  if (!uid || uid === "undefined") {
    throw new Error("UID yo'q");
  }

  console.log("Izlanayotgan UID:", uid);

  const all = await getAllProducts();
  const list = Array.isArray(all) ? all : normalizeProductList(all);
  const product = list.find(p => p.uid === uid);

  if (product) {
    console.log("MAHSULOT TOPILDI:", product.name || product.title);
    return product;
  } else {
    console.warn("BU UID BAZADA YO'Q:", uid);
    console.log("Mavjud UID lar:", list.map(p => p.uid).slice(0, 10));
    throw new Error("Mahsulot topilmadi");
  }
};