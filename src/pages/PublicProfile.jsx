import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { Phone, MapPin, Globe, User, MessageCircle, ArrowLeft } from "lucide-react";

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

function buildTelegramLink(user) {
  if (!user) return null;

  const rawUsername =
    user.telegram_username ||
    user.username ||
    user.owner_username ||
    (typeof user.handle === "string" ? user.handle : null);

  const telegramId =
    user.telegram_id ||
    user.owner_telegram_id ||
    user.user_telegram_id ||
    null;

  if (rawUsername) {
    const clean = rawUsername.startsWith("@") ? rawUsername.slice(1) : rawUsername;
    return `https://t.me/${clean}`;
  }

  if (telegramId) {
    return `tg://user?id=${telegramId}`;
  }

  return null;
}

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, lang } = useLanguage();
  const { theme } = useTheme();

  const user = location.state?.user || null;

  const localeMap = {
    uz: "uz-UZ",
    ru: "ru-RU",
    en: "en-US",
  };
  const currentLocale = localeMap[lang] || "uz-UZ";

  const displayName =
    user?.name ||
    user?.username ||
    user?.owner_name ||
    t("profile_name_fallback");

  const displayUsernameRaw =
    user?.username ||
    user?.telegram_username ||
    null;

  const usernameLabel = displayUsernameRaw
    ? `@${displayUsernameRaw.replace(/^@/, "")}`
    : t("common_no_data");

  const initials = (displayName
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()) || "U";

  const telegramLink = buildTelegramLink({
    ...user,
    username: displayUsernameRaw,
  });

  const phoneNumber =
    user?.phone_number ||
    user?.owner_phone ||
    null;

  const registeredAt = user?.created_at || null;
  const lastActivity = user?.lastActivity || user?.last_login_at || null;

  const infoItems = [
    {
      label: t("profile_label_phone"),
      value: phoneNumber || t("common_no_data"),
      icon: Phone,
      accent: "text-emerald-600",
    },
    {
      label: t("profile_label_username"),
      value: usernameLabel,
      icon: User,
      accent: "text-slate-600",
    },
  ];

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate(-1);
    }
  };

  const handleSendMessage = () => {
    if (!telegramLink) return;

    try {
      const defaultMessage = t("public_profile_default_message");

      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(defaultMessage).catch(() => {});
      }

      if (typeof window !== "undefined") {
        const tg = window.Telegram && window.Telegram.WebApp;
        if (tg && typeof tg.openTelegramLink === "function") {
          tg.openTelegramLink(telegramLink);
        } else if (window.open) {
          window.open(telegramLink, "_blank");
        }
      }
    } catch (e) {
      console.error("PublicProfile send message error:", e);
    }
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-slate-950 flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white dark:bg-slate-900 rounded-2xl shadow-md p-5 text-center space-y-4">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {t("public_profile_title")}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {t("public_profile_not_available")}
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full border border-gray-300 dark:border-slate-700 text-sm font-medium text-gray-700 dark:text-gray-100 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("public_profile_back")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-950 px-3 pt-2 pb-3 overflow-hidden">
      <div className="max-w-md mx-auto space-y-3 overflow-hidden">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 w-max"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("public_profile_back")}</span>
        </button>

        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 px-4 py-4 sm:px-5 sm:py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              <span className="text-lg font-semibold">{initials}</span>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {displayName}
                </h1>
              </div>
              {lastActivity && (
                <p className="text-white/80 text-xs">
                  {t("public_profile_last_activity")} {" "}
                  {formatDate(lastActivity, currentLocale)}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {infoItems.map(({ label, value, icon: Icon, accent }) => (
              <div
                key={label}
                className="rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-3"
              >
                <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${accent}`} />
                  {label}
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100 break-words">
                  {value || t("common_no_data")}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 text-xs text-gray-700 dark:text-gray-200">
            <div className="rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-3">
              <p className="uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {t("profile_registered_at")}
              </p>
              <p className="mt-1 font-semibold">
                {registeredAt
                  ? formatDate(registeredAt, currentLocale)
                  : t("common_no_data")}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-3 space-y-1">
              <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                {t("public_profile_about")}
              </p>
              <p className="text-sm leading-relaxed">
                {user?.bio || t("public_profile_about_placeholder")}
              </p>
            </div>
          </div>
        </div>

        {telegramLink && (
          <div>
            <button
              type="button"
              onClick={handleSendMessage}
              className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold py-2.5 rounded-2xl shadow-md flex items-center justify-center gap-2 hover:shadow-rose-500/30 transition-all text-sm"
            >
              <MessageCircle className="w-5 h-5" />
              {t("public_profile_send_message")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
