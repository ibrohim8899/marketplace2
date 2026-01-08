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

export const autoLoginWithTelegramId = async (telegramId) => {
  try {
    if (!telegramId) {
      console.warn("Telegram ID yo'q, auto-login bekor qilindi.");
      return false;
    }

    const payload = {
      telegram_id: telegramId,
    };

    const response = await axiosInstance.post("/user/auth/telegram/token/", payload);

    const data = response.data || {};

    return handleAuthResponse(data);

  } catch (error) {
    console.error("Telegram ID orqali auto-login xatoligi:", error.response?.data || error.message);
    throw error;
  }
};

export const applyTokensFromUrl = async ({ access, refresh }) => {
  try {
    if (!access) {
      console.warn("[Telegram] URL token topilmadi yoki bo'sh, auto-login bekor qilindi.");
      return false;
    }

    localStorage.setItem("access_token", access);

    if (refresh) {
      localStorage.setItem("refresh_token", refresh);
    }

    try {
      const { data } = await axiosInstance.get("/user/profile/");
      if (data) {
        try {
          localStorage.setItem("user_profile", JSON.stringify(data));
        } catch (err) {
          console.error("Profilni localStorage'ga saqlab bo'lmadi:", err);
        }
      }
    } catch (err) {
      console.error(
        "Auto-login paytida profilni yuklashda xatolik:",
        err.response?.data || err.message,
      );
    }

    return true;
  } catch (e) {
    console.error("URL token orqali auto-login umumiy xatolik:", e);
    return false;
  }
};
