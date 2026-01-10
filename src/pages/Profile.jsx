import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

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

const formatDate = (value, locale = "uz-UZ") => {
  if (!value) return "";
  try {
    return new Date(value).toLocaleString(locale, {
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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { t, lang } = useLanguage();

  const localeMap = {
    uz: "uz-UZ",
    ru: "ru-RU",
    en: "en-US",
  };
  const currentLocale = localeMap[lang] || "uz-UZ";

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadProfile = () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setHasToken(false);
        setError(t("profile_login_required"));
        setLoading(false);
        return;
      }

      setHasToken(true);
      setLoading(true);

      const fetchProfile = async () => {
        try {
          const { data } = await axiosInstance.get("/user/profile/");
          setProfile(data);
          setError("");
        } catch (err) {
          console.error("Profilni yuklashda xatolik:", err.response?.data || err.message);
          const detail = err.response?.data?.detail || t("profile_load_failed");
          setError(detail);
          if (err.response?.status === 401) {
            setHasToken(false);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    };

    loadProfile();

    const handleAuthUpdated = () => {
      console.log("[Profile] auth_updated event olindi, profil qayta yuklanmoqda");
      loadProfile();
    };

    window.addEventListener("auth_updated", handleAuthUpdated);

    return () => {
      window.removeEventListener("auth_updated", handleAuthUpdated);
    };
  }, [t]);

  const handleLogin = () => {
    navigate("/login");
  };

  const renderEmptyState = () => (
    <div className="bg-white rounded-2xl shadow-md p-6 text-center space-y-4 overflow-x-hidden">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
        <User className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{t("profile_empty_title")}</h2>
        <p className="text-gray-500 text-sm mt-1">
          {error || t("profile_empty_desc")}
        </p>
      </div>

      <button
        onClick={handleLogin}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        <LogIn className="w-5 h-5" />
        {t("profile_go_login_button")}
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-indigo-600">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-sm font-medium">{t("profile_loading")}</p>
        </div>
      </div>
    );
  }

  if (!hasToken || !profile) {
    return (
      <div className="px-4 py-8 bg-gray-50">
        <div className="max-w-md mx-auto">{renderEmptyState()}</div>
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

  const avatarUrl =
    profile.photo ||
    profile.avatar ||
    profile.image ||
    profile.profile_image ||
    profile.picture ||
    null;

  const infoItems = [
    {
      label: t("profile_label_phone"),
      value: profile.phone_number || t("common_no_data"),
      icon: Phone,
      accent: "text-emerald-600",
    },

    {
      label: t("profile_label_username"),
      value: profile.username ? `@${profile.username}` : t("common_no_data"),
      icon: User,
      accent: "text-slate-600",
    },
  ];

  const performLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_profile");
    setProfile(null);
    setHasToken(false);
    setShowLogoutConfirm(false);
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  return (
    <div className="bg-white px-3 pt-2 pb-3 overflow-hidden">
      <div className="space-y-3 overflow-hidden">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 px-4 py-4 sm:px-5 sm:py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={profile.name || t("profile_name_fallback")}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-semibold">
                  {initials}
                </span>
              )}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {profile.name || t("profile_name_fallback")}
                </h1>

                {profile.role && (
                  <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-semibold">
                    {profile.role.toUpperCase()}
                  </span>
                )}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    profile.is_active
                      ? "bg-emerald-500/20 text-emerald-100"
                      : "bg-rose-500/20 text-rose-100"
                  }`}
                >
                  {profile.is_active ? t("profile_status_active") : t("profile_status_inactive")}
                </span>
              </div>
              <p className="text-white/80 text-xs">
                {t("profile_last_activity_label")} {" "}
                {profile.last_login_at ? formatDate(profile.last_login_at, currentLocale) : t("common_no_data")}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {infoItems.map(({ label, value, icon: Icon, accent }) => (
              <div key={label} className="rounded-2xl border border-gray-100 p-3">
                <p className="text-[11px] uppercase tracking-wide text-gray-500 flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${accent}`} />
                  {label}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900 break-words">
                  {value || t("common_no_data")}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 text-xs text-gray-700">
            <div className="rounded-2xl border border-gray-100 p-3">
              <p className="uppercase tracking-wide text-gray-500">
                {t("profile_registered_at")}
              </p>
              <p className="mt-1 font-semibold">
                {profile.created_at ? formatDate(profile.created_at, currentLocale) : t("common_no_data")}
              </p>
            </div>

            {(profile.location || profile.address || profile.website) && (
              <div className="rounded-2xl border border-gray-100 p-3 space-y-1">
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{profile.location}</span>
                  </div>
                )}
                {profile.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{profile.address}</span>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span className="truncate">{profile.website}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <button
            onClick={handleLogoutClick}
            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold py-2.5 rounded-2xl shadow-md flex items-center justify-center gap-2 hover:shadow-rose-500/30 transition-all text-sm"
          >
            <LogOut className="w-5 h-5" />
            {t("profile_logout")}
          </button>
        </div>

        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
            <div className="w-full max-w-sm mx-4 rounded-2xl bg-white text-gray-900 shadow-xl p-5">
              <h2 className="text-lg font-semibold mb-2">
                {t("profile_logout_confirm_title")}
              </h2>
              <p className="text-sm text-gray-700 mb-3">
                {t("profile_logout_confirm_description")}
              </p>
              <p className="text-xs text-gray-500 mb-5">
                {t("profile_logout_info_description")}
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  {t("profile_logout_confirm_cancel")}
                </button>
                <button
                  type="button"
                  onClick={performLogout}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-rose-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t("profile_logout_confirm_yes")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}