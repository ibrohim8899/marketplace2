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
  const { t, lang } = useLanguage();

  const localeMap = {
    uz: "uz-UZ",
    ru: "ru-RU",
    en: "en-US",
  };
  const currentLocale = localeMap[lang] || "uz-UZ";

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setHasToken(false);
      setError(t("profile_login_required"));
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
  }, [t]);

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
      <div className=" px-4 py-8 bg-gray-50">
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

  const infoItems = [
    { label: t("profile_label_email"), value: profile.email, icon: Mail, accent: "text-indigo-600" },
    {
      label: t("profile_label_phone"),
      value: profile.phone_number || t("common_no_data"),
      icon: Phone,
      accent: "text-emerald-600",
    },
    {
      label: t("profile_label_username"),
      value: profile.username || t("common_no_data"),
      icon: User,
      accent: "text-slate-600",
    },
    {
      label: t("profile_label_role"),
      value: profile.role || t("profile_role_unknown"),
      icon: ShieldCheck,
      accent: "text-purple-600",
    },
  ];

  return (
    <div className="py-8 px-4 sm:py-10 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 px-6 py-8 sm:px-8 sm:py-10 text-white">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/20 border border-white/30 backdrop-blur flex items-center justify-center text-2xl sm:text-3xl font-bold">
                {initials}
              </div> */}

              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">{profile.name || t("profile_name_fallback")}</h1>

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
                    {profile.is_active ? t("profile_status_active") : t("profile_status_inactive")}
                  </span>
                </div>
                <p className="text-white/80 text-sm">
                  {t("profile_last_activity_label")} {profile.last_login_at ? formatDate(profile.last_login_at, currentLocale) : t("common_no_data")}
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
                    {value || t("common_no_data")}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 p-4 sm:p-5 bg-white">
                <p className="text-xs uppercase tracking-wide text-gray-500">{t("profile_registered_at")}</p>
                <p className="mt-2 text-base sm:text-lg font-semibold text-gray-900">
                  {profile.created_at ? formatDate(profile.created_at, currentLocale) : t("common_no_data")}
                </p>
              </div>
              <div className="rounded-2xl border border-gray-100 p-4 sm:p-5 bg-white">
                <p className="text-xs uppercase tracking-wide text-gray-500">{t("profile_telegram_id")}</p>
                <p className="mt-2 text-base sm:text-lg font-semibold text-gray-900">
                  {profile.telegram_id || t("common_no_data")}
                </p>
              </div>
            </div>

            {profile.location || profile.address || profile.website ? (
              <div className="rounded-3xl border border-dashed border-indigo-100 bg-indigo-50/60 p-5 sm:p-6">
                <h3 className="text-sm font-semibold text-indigo-900 mb-4">{t("profile_extra_info_title")}</h3>

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
            {t("profile_logout")}
          </button>
        </div>
      </div>
    </div>
  );
}