import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // Agar yo'q bo'lsa qo'shing
import Home from './pages/Home';
import Categories from './pages/Categories'; // Bu sahifa endi UID orqali ishlaydi
import ProductDetailPage from './pages/ProductDetailPage';
import SellerDashboard from './components/seller/SellerDashboard';
import TopSellers from './pages/TopSellers';
import SearchResults from './pages/SearchResults';
import ProfileCard from './pages/Profile';
import LoginPage from './pages/LoginPage';
import Breadcrumb from './components/layout/Breadcrumb';
import NotFound from './pages/404';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Navbar from './components/layout/Navbar'; // Agar yo'q bo'lsa, qo'shing
import Footer from './components/layout/Footer'; // Agar yo'q bo'lsa, qo'shing
import { loginWithTelegram, applyTokensFromUrl } from './api/auth';

export default function App() {
  useEffect(() => {
    // Telegram WebApp auto-login (faqat Telegram ichida ishlaydi)
    const initTelegramAuth = async () => {
      try {
        if (typeof window === 'undefined') {
          return;
        }

        const tg = window.Telegram && window.Telegram.WebApp;
        if (!tg) {
          // Oddiy browserda - bu normal holat, xato emas
          return;
        }

        let urlPhoneNumber = null;

        try {
          const url = new URL(window.location.href);
          const urlAccessToken =
            url.searchParams.get('access_token') ||
            url.searchParams.get('token') ||
            url.searchParams.get('access');
          const urlRefreshToken =
            url.searchParams.get('refresh_token') ||
            url.searchParams.get('refresh');

          urlPhoneNumber =
            url.searchParams.get('phone_number') ||
            url.searchParams.get('phone') ||
            url.searchParams.get('tg_phone');

          if (urlAccessToken) {
            const applied = await applyTokensFromUrl({
              access: urlAccessToken,
              refresh: urlRefreshToken,
            });

            if (applied) {
              const cleanUrl =
                window.location.origin + window.location.pathname + window.location.hash;
              window.history.replaceState({}, document.title, cleanUrl);
              console.log('[Telegram] URL token orqali auto-login bajarildi.');
              return;
            }
          }
        } catch (e) {
          console.error('[Telegram] URL token parse xatoligi:', e);
        }

        const hasToken = !!localStorage.getItem('access_token');
        if (hasToken) {
          console.log("[Telegram] Token mavjud, auto-login kerak emas.");
          return;
        }

      const initDataUnsafe = tg.initDataUnsafe || {};
      const rawInitData = tg.initData || "";

      let user = initDataUnsafe.user;

      if ((!user || !user.id) && rawInitData) {
        try {
          const params = new URLSearchParams(rawInitData);
          const userStr = params.get("user");
          if (userStr) {
            const parsedUser = JSON.parse(userStr);
            if (parsedUser && parsedUser.id) {
              user = parsedUser;
            }
          }
        } catch (e) {
          console.error("Telegram user parse xatoligi:", e);
        }
      }

      if (!user || !user.id) {
        console.warn("[Telegram] user ma'lumoti topilmadi, auto-login to'xtadi.");
        return;
      }

      let hash = initDataUnsafe.hash;
      let authDate = initDataUnsafe.auth_date;

      if (!hash || !authDate) {
        try {
          const params = new URLSearchParams(rawInitData);
          if (!hash) hash = params.get("hash");
          if (!authDate) authDate = params.get("auth_date");
        } catch (e) {
          console.error("Telegram initData parse xatoligi:", e);
        }
      }

      if (!hash) {
        console.warn("[Telegram] hash topilmadi, auto-login to'xtadi.");
        return;
      }

      const telegramData = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        photo_url: user.photo_url,
        auth_date: authDate,
        hash,
      };

      if (urlPhoneNumber) {
        telegramData.phone_number = urlPhoneNumber;
      }

      console.log("[Telegram] Auto login urinyapti", telegramData);

      loginWithTelegram(telegramData)
        .then((result) => {
          console.log("[Telegram] loginWithTelegram yakuni:", result);
          if (!result) {
            console.error("[Telegram] loginWithTelegram true qaytarmadi, access_token kelmadi.");
          }
        })
        .catch((error) => {
          console.error(
            "Telegram auto login xatoligi:",
            error?.response?.data || error.message || error,
          );
        });
    } catch (error) {
      console.error("Telegram WebApp init xatoligi:", error);
    }
  };

    initTelegramAuth();
  }, []);

  return (
    <CartProvider>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-14 pb-20 transition-colors duration-300">
        <Breadcrumb />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:uid" element={<Categories />} /> {/* UID orqali o'zgartirdim */}
        <Route path="/product/:uid" element={<ProductDetailPage />} /> {/* :id → :uid qildim, logik bo'lsin */}
        <Route path="/seller" element={<SellerDashboard />} />
        {/* <Route path="/top-sellers" element={<TopSellers />} /> */}
        <Route path="/search" element={<SearchResults />} />
        <Route path="/profile" element={<ProfileCard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<Cart />} /> 
        <Route path="/wishlist" element={<Wishlist />} /> 
        <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </CartProvider>
  );
}