// src/api/comments.js
import axiosInstance from "./axiosInstance";

// Mahsulot uchun commentlarni olish
export const getComments = async (productUid) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return [];
    }

    // Swagger bo'yicha faqat bitta GET endpoint bor: /comment/my/
    // U foydalanuvchining barcha sharhlarini qaytaradi, biz mahsulot bo'yicha filtrlab olamiz
    const response = await axiosInstance.get("/comment/my/");

    const allComments = Array.isArray(response.data)
      ? response.data
      : response.data.results || [];

    // Mahsulotga mos kommentlarni filterlaymiz
    const filtered = allComments.filter((c) => {
      // Product UID bilan solishtirish
      if (c.product_uid === productUid) return true;
      if (c.product?.uid === productUid) return true;
      if (c.product_id === productUid) return true;
      if (c.product === productUid) return true;
      
      // Agar product obyekt bo'lsa va uning uid si bor
      if (typeof c.product === 'object' && c.product?.uid === productUid) return true;
      
      return false;
    });

    return filtered;
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
export const updateComment = async (commentId, text, rating) => {
  try {
    const payload = {
      body: text,
      rating,
    };
    const response = await axiosInstance.put(`/comment/${commentId}/update/`, payload);
    return response.data;
  } catch (error) {
    console.error("Commentni yangilashda xatolik:", error);
    throw error;
  }
};
