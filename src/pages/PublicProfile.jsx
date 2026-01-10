import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { User, MessageCircle, ArrowLeft } from "lucide-react";

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
  const { t } = useLanguage();
  const { theme } = useTheme();

  const user = location.state?.user || null;

  const initials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : (user?.username?.[0] || "U").toUpperCase();

  const usernameLabel = user?.username ? `@${user.username}` : t("common_no_data");

  const telegramLink = buildTelegramLink(user);

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
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 dark:bg-slate-950 px-3 pt-2 pb-3">
      <div className="max-w-md mx-auto space-y-4">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 w-max"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t("public_profile_back")}</span>
        </button>

        <div className="rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-500 dark:from-slate-800 dark:via-slate-900 dark:to-indigo-900 px-5 py-5 text-white shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-semibold">
              {initials}
            </div>
            <div className="flex-1 space-y-1">
              <h1 className="text-xl font-bold truncate">
                {user.name || t("profile_name_fallback")}
              </h1>
              <p className="text-sm text-white/80 truncate">{usernameLabel}</p>
              {user.lastActivity && (
                <p className="text-[11px] text-white/70">
                  {t("public_profile_last_activity")} {user.lastActivity}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 space-y-3 text-sm text-gray-700 dark:text-gray-200">
          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {t("public_profile_about")}
          </p>
          <p className="text-sm leading-relaxed">
            {user.bio || t("public_profile_about_placeholder")}
          </p>
        </div>

        {telegramLink && (
          <button
            type="button"
            onClick={handleSendMessage}
            className="w-full bg-sky-500 hover:bg-sky-600 active:bg-sky-700 dark:bg-sky-400 dark:hover:bg-sky-500 dark:active:bg-sky-600 text-white font-semibold py-3 rounded-full shadow-md flex items-center justify-center gap-2 text-sm"
          >
            <MessageCircle className="w-5 h-5" />
            {t("public_profile_send_message")}
          </button>
        )}
      </div>
    </div>
  );
}
