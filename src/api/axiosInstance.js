// src/api/axiosInstance.js
import axios from "axios";

// Env'dan kelgan base URL ni normalizatsiya qilamiz, shunda har doim to'g'ri HTTP URL bo'ladi
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

let baseURL;

if (!rawBaseUrl) {
  // Env bo'sh bo'lsa, development uchun lokal proxy yoki relative "/api" ishlatamiz
  baseURL = "/api";
} else if (rawBaseUrl.startsWith("http://") || rawBaseUrl.startsWith("https://")) {
  // To'liq URL allaqachon berilgan bo'lsa, shuni ishlatamiz
  baseURL = rawBaseUrl;
} else {
  // Protokol yozilmagan bo'lsa (masalan, "77.237.245.47:4800" yoki "/77.237.245.47:4800")
  const cleaned = rawBaseUrl.replace(/^\/+/, ""); // boshidagi '/' belgilarini olib tashlaymiz
  baseURL = `http://${cleaned}`;
}

console.log("[API] baseURL:", baseURL);

const axiosInstance = axios.create({
  baseURL,
  // withCredentials: true, // CORS muammosi uchun o'chirildi
});

// Agar token bo'lsa (kelajakda login bo'lsa)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const isFormData = config.data instanceof FormData;
  if (isFormData) {
    delete config.headers["Content-Type"];
  } else if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

export default axiosInstance;

