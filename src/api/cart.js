// src/api/cart.js
import axiosInstance from "./axiosInstance";

// 1. Savatchani olish (GET)
export const getCartItems = async () => {
  try {
    const response = await axiosInstance.get("/cart/car_list/");
    // Agar server array qaytarsa o'zini, agar { results: [] } qaytarsa results ni olamiz
    return Array.isArray(response.data) ? response.data : response.data.results || [];
  } catch (error) {
    console.error("API: Savatchani olishda xatolik:", error);
    throw error;
  }
};

// 2. Savatchaga qo'shish (POST)
export const addToCartApi = async (product) => {
  // Swagger talabi bo'yicha body yasaymiz
  const productUid = product.uid || product.id || product._id;
  
  const payload = {
    uid: productUid, // Ba'zi backendlar buni ham so'raydi
    product_uid: productUid,
    product: {
      name: product.name || product.title || "Nomsiz mahsulot",
      cost: String(product.cost || product.price || 0), // String talab qilinishi mumkin
      amount: Number(product.amount || product.stock || 1),
      category: product.category || "General",
      description: product.description || "",
      location: product.location || "",
      status: product.status || "pending"
    }
  };

  try {
    const response = await axiosInstance.post("/cart/cart/add/", payload);
    return response.data;
  } catch (error) {
    console.error("API: Savatchaga qo'shishda xatolik:", error);
    throw error;
  }
};

// 3. Savatchadan o'chirish (DELETE)
export const removeFromCartApi = async (productUid) => {
  try {
    // Swaggerda path parametri: /cart/cart/remove/{product_uid}/
    const response = await axiosInstance.delete(`/cart/cart/remove/${productUid}/`);
    return response.data;
  } catch (error) {
    console.error("API: O'chirishda xatolik:", error);
    throw error;
  }
};