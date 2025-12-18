import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  ShieldCheck,
  User,
  LogOut,
  LogIn,
  Loader2,
} from "lucide-react";
import axiosInstance from "../api/axiosInstance";

const formatDate = (value) => {
  if (!value) return "Ma'lumot yo'q";
  try {
    return new Date(value).toLocaleString("uz-UZ", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return value;
  }
};

export default function ProfileCard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setHasToken(false);
      setError("Profil ma'lumotlarini ko'rish uchun tizimga kiring.");
      setLoading(false);
      return;
    }

    setHasToken(true);
    const fetchProfile = async () => {
      try {
        const { data } = await axiosInstance.get("/user/profile/");
        setProfile(data);
      } catch (err) {
        console.error("Profilni yuklashda xatolik:", err.response?.data || err.message);
        const detail = err.response?.data?.detail || "Profilni yuklab bo'lmadi.";
        setError(detail);
        if (err.response?.status === 401) {
          setHasToken(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_profile");
    setProfile(null);
    setHasToken(false);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const renderEmptyState = () => (
    <div className="bg-white rounded-3xl shadow-xl p-8 text-center space-y-5">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
        <User className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Profil ma'lumotlari mavjud emas</h2>
        <p className="text-gray-500 text-sm mt-2">
          {error || "Ilova imkoniyatlaridan foydalanish uchun tizimga kiring."}
        </p>
      </div>
      <button
        onClick={handleLogin}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-2xl transition-all flex items-center justify-center gap-2"
      >
        <LogIn className="w-5 h-5" />
        Kirish sahifasiga o'tish
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-indigo-600">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-sm font-medium">Profil ma'lumotlari yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!hasToken || !profile) {
    return (
      <div className="min-h-screen px-4 py-16">
        <div className="max-w-xl mx-auto">{renderEmptyState()}</div>
      </div>
    );
  }

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : profile.email?.[0]?.toUpperCase() || "U";

  const infoItems = [
    { label: "Email", value: profile.email, icon: Mail, accent: "text-indigo-600" },
    { label: "Telefon", value: profile.phone_number || "Ma'lumot yo'q", icon: Phone, accent: "text-emerald-600" },
    { label: "Foydalanuvchi nomi", value: profile.username || "Ma'lumot yo'q", icon: User, accent: "text-slate-600" },
    { label: "Role", value: profile.role || "Aniqlanmagan", icon: ShieldCheck, accent: "text-purple-600" },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 px-6 py-8 sm:px-8 sm:py-10 text-white">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/20 border border-white/30 backdrop-blur flex items-center justify-center text-2xl sm:text-3xl font-bold">
                {initials}
              </div> */}

              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{profile.name || "Ism ko'rsatilmagan"}</h1>
                  {profile.role && (
                    <span className="px-3 py-1 rounded-full bg-white/15 text-sm font-semibold">
                      {profile.role.toUpperCase()}
                    </span>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      profile.is_active
                        ? "bg-emerald-500/20 text-emerald-100"
                        : "bg-rose-500/20 text-rose-100"
                    }`}
                  >
                    {profile.is_active ? "Faol foydalanuvchi" : "Nofaol"}
                  </span>
                </div>
                <p className="text-white/80 text-sm">
                  Oxirgi faoliyat: {formatDate(profile.last_login_at)}
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-8 sm:py-10 space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
              {infoItems.map(({ label, value, icon: Icon, accent }) => (
                <div key={label} className="rounded-2xl border border-gray-100 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500 flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${accent}`} />
                    {label}
                  </p>
                  <p className="mt-2 text-base font-semibold text-gray-900 break-words">
                    {value || "Ma'lumot yo'q"}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 p-4 sm:p-5 bg-white">
                <p className="text-xs uppercase tracking-wide text-gray-500">Ro'yxatdan o'tgan vaqt</p>
                <p className="mt-2 text-base sm:text-lg font-semibold text-gray-900">{formatDate(profile.created_at)}</p>
              </div>
              <div className="rounded-2xl border border-gray-100 p-4 sm:p-5 bg-white">
                <p className="text-xs uppercase tracking-wide text-gray-500">Telegram ID</p>
                <p className="mt-2 text-base sm:text-lg font-semibold text-gray-900">
                  {profile.telegram_id || "Ma'lumot yo'q"}
                </p>
              </div>
            </div>

            {profile.location || profile.address || profile.website ? (
              <div className="rounded-3xl border border-dashed border-indigo-100 bg-indigo-50/60 p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-indigo-900 mb-4">Qo'shimcha ma'lumotlar</h3>
                <div className="space-y-3 text-sm text-indigo-900/90">
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.address}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <a
                        href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        {profile.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex">
          <button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold py-3 rounded-2xl shadow-lg flex items-center justify-center gap-2 hover:shadow-rose-500/40 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Chiqish
          </button>
        </div>
      </div>
    </div>
  );
}