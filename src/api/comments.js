// src/api/comments.js
import axiosInstance from "./axiosInstance";

// Mahsulot uchun commentlarni olish
export const getComments = async (productUid) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return [];
    }

    let response;
    if (productUid) {
      // Muayyan mahsulotga tegishli barcha sharhlar
      response = await axiosInstance.get(`/comment/product/${productUid}/`);
    } else {
      // Foydalanuvchining o'z sharhlari
      response = await axiosInstance.get("/comment/my/");
    }

    const data = Array.isArray(response.data)
      ? response.data
      : response.data.results || [];

    return data;
  } catch (error) {
    console.error(
      "Commentlarni olishda xatolik:",
      error.response?.data || error.message
    );
    // Xatolik bo'lsa ham UI yiqilmasligi uchun bo'sh massiv qaytaramiz
    return [];
  }
};

// Comment qo'shish
export const createComment = async (productUid, text, rating = 5) => {
  try {
    // Backend 400 da "body: This field is required" deb yuborgani uchun
    // matn maydoni sifatida aynan `body` ni yuboramiz
    const payload = {
      product: productUid,
      body: text,
      rating,
    };

    const response = await axiosInstance.post("/comment/create/", payload);
    return response.data;
  } catch (error) {
    console.error(
      "Comment qo'shishda xatolik:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Commentni o'chirish
export const deleteComment = async (commentId) => {
  try {
    const response = await axiosInstance.delete(`/comment/${commentId}/delete/`);
    return response.data;
  } catch (error) {
    console.error("Commentni o'chirishda xatolik:", error);
    throw error;
  }
};

// Commentni yangilash
export const updateComment = async (commentId, text) => {
  try {
    const payload = {
      body: text,
    };
    const response = await axiosInstance.put(`/comment/${commentId}/update/`, payload);
    return response.data;
  } catch (error) {
    console.error("Commentni yangilashda xatolik:", error);
    throw error;
  }
};
