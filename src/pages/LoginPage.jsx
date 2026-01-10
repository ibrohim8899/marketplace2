// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, ArrowLeft } from 'lucide-react';
import { loginUser } from '../api/auth';
import { useLanguage } from '../context/LanguageContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tg = window.Telegram && window.Telegram.WebApp;
    if (!tg) return;

    setIsTelegram(true);

    const hasToken = !!localStorage.getItem('access_token');
    if (hasToken) {
      navigate('/profile', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError(t('login_error_required'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const success = await loginUser(formData.email, formData.password);
      
      if (success) {
        // Login muvaffaqiyatli bo'lsa, profilga qaytish
        navigate('/profile');
      } else {
        setError(t('login_error_invalid'));
      }
    } catch (err) {
      setError(t('login_error_generic_prefix') + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-950 flex items-center justify-center px-3 py-4">
      <div className="w-full max-w-sm">
        {/* Orqaga qaytish tugmasi */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('login_back')}
        </Link>

        {/* Login karta */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-center">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-2">
              <LogIn className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-lg font-semibold text-white">{t('login_title')}</h1>
            <p className="text-blue-100 text-[11px] mt-0.5">{t('login_subtitle')}</p>
          </div>

          {/* Form */}
          <div className="px-5 py-4">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {!isTelegram && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    placeholder="example@email.com"
                    required
                  />
                </div>

                {/* Parol */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('login_password_label')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2 pr-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit tugmasi */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t('login_loading')}
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      {t('login_submit')}
                    </>
                  )}
                </button>
              </form>
            )}

            {isTelegram && (
              <div className="mt-4 text-sm text-gray-600 text-center">
                {t('profile_login_required')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
