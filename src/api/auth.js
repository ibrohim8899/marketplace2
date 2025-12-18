// src/api/auth.js
import axiosInstance from "./axiosInstance";

const handleAuthResponse = (data) => {
  const accessToken =
    data?.tokens?.access ||
    data?.access ||
    data?.token ||
    data?.access_token;

  const refreshToken =
    data?.tokens?.refresh ||
    data?.refresh ||
    data?.refresh_token;

  const profile =
    data?.user ||
    data?.profile ||
    data?.user_data ||
    data?.user_info ||
    null;

  if (!accessToken) {
    return false;
  }

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
};

export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/user/auth/login/", {
      email,
      password,
    });

    console.log("Login javobi:", response.data);

    const data = response.data || {};

    return handleAuthResponse(data);

  } catch (error) {
    console.error("Login xatoligi:", error.response?.data || error.message);
    throw error;
  }
};

export const loginWithTelegram = async (telegramData) => {
  try {
    const response = await axiosInstance.post("/user/auth/telegram/", telegramData);

    const data = response.data || {};

    return handleAuthResponse(data);

  } catch (error) {
    console.error("Telegram login xatoligi:", error.response?.data || error.message);
    throw error;
  }
};
