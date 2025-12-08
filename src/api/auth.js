// src/api/auth.js
import axiosInstance from "./axiosInstance";

export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/user/auth/login/", {
      email,
      password,
    });

    console.log("Login javobi:", response.data);

    const data = response.data || {};

    // Token turli formatlarda kelishi mumkin, hammasini tekshiramiz
    const accessToken =
      data.tokens?.access ||
      data.access ||
      data.token ||
      data.access_token;

    const refreshToken =
      data.tokens?.refresh ||
      data.refresh ||
      data.refresh_token;

    // Foydalanuvchi ma'lumotlari (agar backend yuborsa)
    const profile =
      data.user ||
      data.profile ||
      data.user_data ||
      data.user_info ||
      null;

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      if (refreshToken) {
        localStorage.setItem("refresh_token", refreshToken);
      }

      if (profile) {
        try {
          localStorage.setItem("user_profile", JSON.stringify(profile));
        } catch (err) {
          console.error("Foydalanuvchi ma'lumotlarini saqlab bo'lmadi:", err);
        }
      }

      return true;
    }

    return false;

  } catch (error) {
    console.error("Login xatoligi:", error.response?.data || error.message);
    throw error;
  }
};
