// src/components/layout/Navbar.jsx
import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';
import { Moon, Sun, ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadRole = () => {
      try {
        const raw = localStorage.getItem('user_profile');
        if (!raw) {
          setUserRole(null);
          return;
        }

        const data = JSON.parse(raw);
        const role =
          data?.role ||
          data?.user_role ||
          data?.profile?.role ||
          null;

        setUserRole(role || null);
      } catch (err) {
        console.error('[Navbar] user_profile parse error:', err);
        setUserRole(null);
      }
    };

    loadRole();

    const handler = () => loadRole();
    window.addEventListener('auth_updated', handler);
    return () => window.removeEventListener('auth_updated', handler);
  }, []);

  const languages = [
    { code: 'uz', label: "O'zbek" },
    { code: 'ru', label: 'Русский' },
    { code: 'en', label: 'English' },
  ];

  const current = languages.find((item) => item.code === lang) || languages[0];
  const isSeller = userRole === 'seller';

  const handleSelect = (code) => {
    setLang(code);
    setOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 border-b border-gray-200 dark:border-slate-800 z-20 backdrop-blur transition-colors duration-300">
      <div className="max-w-screen-md mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-sm font-bold text-blue-600">TechGigs MP</Link>

        <div className="flex items-center gap-4 text-sm font-medium">

          {isSeller && (
            <Link to="/seller" className="hover:text-blue-600">{t('nav_seller')}</Link>
          )}

          {/* <Link to="/top-sellers" className="hover:text-blue-600">Top Sotuvchilar</Link> */}

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 transition-all duration-150"
            >
              <span className="text-xs font-medium">{current.label}</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}

              />
            </button>

            <div
              className={`absolute right-0 mt-2 w-32 rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-900 shadow-lg overflow-hidden transition-all duration-150 origin-top-right ${
                open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'
              }`}
            >
              {languages.map((item) => (

                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelect(item.code)}
                  className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
                    lang === item.code
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200'
                      : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}

            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
            aria-label={t('nav_toggle_theme')}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

        </div>
      </div>
    </nav>
  );
}