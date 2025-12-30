import { createContext, useContext, useMemo, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const DEFAULT_LANG = 'uz';
const STORAGE_KEY = 'app_lang';

const getInitialLang = () => {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (translations?.[stored])) {
      return stored;
    }
  } catch {
    // ignore
  }
  return DEFAULT_LANG;
};

const translations = {
  uz: {
    nav_seller: 'Sotuvchi',
    nav_toggle_theme: 'Temani almashtirish',
    home_categories: 'Kategoriyalar',
    home_all_products: 'Barcha tovarlar',
    recommended_empty: 'Tavsiya yo‘q',
    footer_home: 'Bosh',
    footer_search: 'Qidiruv',
    footer_wishlist: 'Sevimli',
    footer_profile: 'Profil',

    breadcrumb_home: 'Bosh sahifa',
    breadcrumb_seller: 'Sotuvchi paneli',
    breadcrumb_top_sellers: 'Top sotuvchilar',
    breadcrumb_search_results: 'Qidiruv natijalari',
    breadcrumb_profile: 'Profil',
    breadcrumb_category: 'Kategoriya',
    breadcrumb_product: 'Mahsulot',
    breadcrumb_all: 'Barcha',

    categories_all_label: 'Barcha',

    common_no_data: "Ma'lumot yo'q",

    search_results_title: 'Qidiruv natijalari',
    search_query_label: "Qidiruv so'zi",
    search_query_all_products: 'Barcha mahsulotlar',
    search_results_hint: "Natijalar ro'yxati quyida",

    sf_placeholder_query: 'Tovar qidirish...',
    sf_submit: 'Qidirish',
    sf_toggle_filters: 'Filtrlar',
    sf_clear: 'Tozalash',
    sf_category_label: 'Kategoriya',
    sf_category_all: 'Barcha kategoriyalar',
    sf_loading: 'Yuklanmoqda...',
    sf_price_min_label: "Min narx (so'm)",
    sf_price_max_label: "Max narx (so'm)",
    sf_location_label: 'Joylashuv',
    sf_location_placeholder: 'Masalan: Toshkent, Namangan',
    sf_apply: 'Filtrlash',
    sf_active_filters_label: 'Faol filtrlar:',
    sf_active_query_label: 'Qidiruv:',
    sf_active_category_label: 'Kategoriya:',
    sf_active_price_label: 'Narx:',
    sf_active_location_label: 'Joylashuv:',

    productlist_no_results: 'Bu filtr bo‘yicha tovar topilmadi',

    emptystate_default: 'Hech nima topilmadi',

    login_back: 'Orqaga qaytish',
    login_title: 'Tizimga kirish',
    login_subtitle: 'Barcha imkoniyatlardan foydalanish uchun',
    login_error_required: "Barcha maydonlarni to'ldiring!",
    login_error_invalid: 'Login yoki parol xato!',
    login_error_generic_prefix: 'Xatolik: ',
    login_password_label: 'Parol',
    login_loading: 'Kirilmoqda...',
    login_submit: 'Kirish',

    review_error_empty: 'Sharh yozing!',
    review_login_required: 'Sharh yozish uchun tizimga kiring!',
    review_login_required_title: 'Tizimga kiring',
    review_sent_title: 'Sharh yuborildi',
    review_sent_message: 'Sharhingiz muvaffaqiyatli saqlandi.',
    review_error_prefix: "Sharh qo'shishda xatolik: ",
    review_error_title: 'Sharh yuborilmadi',
    review_placeholder: 'Sharh yozing...',
    review_submit_loading: 'Yuborilmoqda...',
    review_submit: 'Yuborish',
    review_loading: 'Yuklanyapti...',
    review_empty: "Hali sharhlar yo'q",
    review_delete_success_title: "Sharh o'chirildi",
    review_delete_success_message: "Sharhingiz muvaffaqiyatli o'chirildi.",
    review_delete_fail_title: "Sharh o'chirilmadi",
    review_update_empty_title: "Matn bo'sh",
    review_update_empty_message: 'Sharh matnini kiriting.',
    review_update_success_title: 'Sharh yangilandi',
    review_update_success_message: 'Sharhingiz muvaffaqiyatli yangilandi.',
    review_update_fail_title: 'Sharh yangilanmadi',
    review_show_less: "Kamroq ko'rsatish",
    review_show_more: "Ko'proq o'qish",

    top_sellers_title: 'Top Sotuvchilar',

    testlogin_title: 'Test Login',
    testlogin_success_title: 'Muvaffaqiyatli kirildi',
    testlogin_success_message: "Endi savatcha va boshqa funksiyalar to'liq ishlaydi.",
    testlogin_error_token: 'Token kelmadi, backend javobini tekshiring.',
    testlogin_error_invalid: 'Login yoki parol xato!',

    cart_add_error_title: "Savatchaga qo'shib bo'lmadi",
    cart_add_error_message: 'Tizimga kiring yoki internet aloqasini tekshiring.',
  },
  ru: {
    nav_seller: 'Продавец',
    nav_toggle_theme: 'Сменить тему',
    home_categories: 'Категории',
    home_all_products: 'Все товары',
    recommended_empty: 'Рекомендаций нет',
    footer_home: 'Главная',
    footer_search: 'Поиск',
    footer_wishlist: 'Избранное',
    footer_profile: 'Профиль',

    breadcrumb_home: 'Главная',
    breadcrumb_seller: 'Панель продавца',
    breadcrumb_top_sellers: 'Топ продавцы',
    breadcrumb_search_results: 'Результаты поиска',
    breadcrumb_profile: 'Профиль',
    breadcrumb_category: 'Категория',
    breadcrumb_product: 'Товар',
    breadcrumb_all: 'Все',

    categories_all_label: 'Все',

    common_no_data: 'Нет данных',

    search_results_title: 'Результаты поиска',
    search_query_label: 'Поисковый запрос',
    search_query_all_products: 'Все товары',
    search_results_hint: 'Список результатов ниже',

    sf_placeholder_query: 'Искать товар...',
    sf_submit: 'Искать',
    sf_toggle_filters: 'Фильтры',
    sf_clear: 'Сбросить',
    sf_category_label: 'Категория',
    sf_category_all: 'Все категории',
    sf_loading: 'Загрузка...',
    sf_price_min_label: 'Мин. цена',
    sf_price_max_label: 'Макс. цена',
    sf_location_label: 'Местоположение',
    sf_location_placeholder: 'Например: Ташкент, Наманган',
    sf_apply: 'Фильтровать',
    sf_active_filters_label: 'Активные фильтры:',
    sf_active_query_label: 'Поиск:',
    sf_active_category_label: 'Категория:',
    sf_active_price_label: 'Цена:',
    sf_active_location_label: 'Местоположение:',

    productlist_no_results: 'По этим фильтрам товары не найдены',

    emptystate_default: 'Ничего не найдено',

    login_back: 'Назад',
    login_title: 'Вход в систему',
    login_subtitle: 'Чтобы пользоваться всеми возможностями',
    login_error_required: 'Заполните все поля!',
    login_error_invalid: 'Неверный логин или пароль!',
    login_error_generic_prefix: 'Ошибка: ',
    login_password_label: 'Пароль',
    login_loading: 'Вход...',
    login_submit: 'Войти',

    review_error_empty: 'Напишите отзыв!',
    review_login_required: 'Чтобы оставить отзыв, войдите в систему!',
    review_login_required_title: 'Войдите в систему',
    review_sent_title: 'Отзыв отправлен',
    review_sent_message: 'Ваш отзыв успешно сохранён.',
    review_error_prefix: 'Ошибка при добавлении отзыва: ',
    review_error_title: 'Отзыв не отправлен',
    review_placeholder: 'Напишите отзыв...',
    review_submit_loading: 'Отправка...',
    review_submit: 'Отправить',
    review_loading: 'Загрузка...',
    review_empty: 'Отзывов пока нет',
    review_delete_success_title: 'Отзыв удалён',
    review_delete_success_message: 'Ваш отзыв успешно удалён.',
    review_delete_fail_title: 'Не удалось удалить отзыв',
    review_update_empty_title: 'Пустой текст',
    review_update_empty_message: 'Введите текст отзыва.',
    review_update_success_title: 'Отзыв обновлён',
    review_update_success_message: 'Ваш отзыв успешно обновлён.',
    review_update_fail_title: 'Не удалось обновить отзыв',
    review_show_less: 'Показать меньше',
    review_show_more: 'Читать далее',

    top_sellers_title: 'Топ продавцы',

    testlogin_title: 'Тестовый вход',
    testlogin_success_title: 'Успешный вход',
    testlogin_success_message: 'Теперь корзина и другие функции работают полностью.',
    testlogin_error_token: 'Токен не получен, проверьте ответ backend.',
    testlogin_error_invalid: 'Неверный логин или пароль!',

    cart_add_error_title: 'Не удалось добавить в корзину',
    cart_add_error_message: 'Войдите в систему или проверьте интернет-соединение.',
  },
  en: {
    nav_seller: 'Seller',
    nav_toggle_theme: 'Toggle theme',
    home_categories: 'Categories',
    home_all_products: 'All products',
    recommended_empty: 'No recommendations',
    footer_home: 'Home',
    footer_search: 'Search',
    footer_wishlist: 'Wishlist',
    footer_profile: 'Profile',

    breadcrumb_home: 'Home',
    breadcrumb_seller: 'Seller dashboard',
    breadcrumb_top_sellers: 'Top sellers',
    breadcrumb_search_results: 'Search results',
    breadcrumb_profile: 'Profile',
    breadcrumb_category: 'Category',
    breadcrumb_product: 'Product',
    breadcrumb_all: 'All',

    categories_all_label: 'All',

    common_no_data: 'No data',

    search_results_title: 'Search results',
    search_query_label: 'Search query',
    search_query_all_products: 'All products',
    search_results_hint: 'Results are listed below',

    sf_placeholder_query: 'Search products...',
    sf_submit: 'Search',
    sf_toggle_filters: 'Filters',
    sf_clear: 'Clear',
    sf_category_label: 'Category',
    sf_category_all: 'All categories',
    sf_loading: 'Loading...',
    sf_price_min_label: 'Min price',
    sf_price_max_label: 'Max price',
    sf_location_label: 'Location',
    sf_location_placeholder: 'E.g. Tashkent, Namangan',
    sf_apply: 'Apply filters',
    sf_active_filters_label: 'Active filters:',
    sf_active_query_label: 'Search:',
    sf_active_category_label: 'Category:',
    sf_active_price_label: 'Price:',
    sf_active_location_label: 'Location:',

    productlist_no_results: 'No products found for these filters',

    emptystate_default: 'Nothing found',

    login_back: 'Go back',
    login_title: 'Sign in',
    login_subtitle: 'To use all features',
    login_error_required: 'Please fill in all fields!',
    login_error_invalid: 'Incorrect email or password!',
    login_error_generic_prefix: 'Error: ',
    login_password_label: 'Password',
    login_loading: 'Signing in...',
    login_submit: 'Login',

    review_error_empty: 'Write a review!',
    review_login_required: 'Please sign in to leave a review!',
    review_login_required_title: 'Sign in',
    review_sent_title: 'Review sent',
    review_sent_message: 'Your review has been saved successfully.',
    review_error_prefix: 'Error while adding review: ',
    review_error_title: 'Review not sent',
    review_placeholder: 'Write a review...',
    review_submit_loading: 'Sending...',
    review_submit: 'Send',
    review_loading: 'Loading...',
    review_empty: 'No reviews yet',
    review_delete_success_title: 'Review deleted',
    review_delete_success_message: 'Your review has been deleted.',
    review_delete_fail_title: 'Failed to delete review',
    review_update_empty_title: 'Empty text',
    review_update_empty_message: 'Enter review text.',
    review_update_success_title: 'Review updated',
    review_update_success_message: 'Your review has been updated.',
    review_update_fail_title: 'Failed to update review',
    review_show_less: 'Show less',
    review_show_more: 'Read more',

    top_sellers_title: 'Top Sellers',

    testlogin_title: 'Test Login',
    testlogin_success_title: 'Logged in successfully',
    testlogin_success_message: 'Now cart and other features work fully.',
    testlogin_error_token: 'Token not received, please check backend response.',
    testlogin_error_invalid: 'Incorrect email or password!',

    cart_add_error_title: 'Could not add to cart',
    cart_add_error_message: 'Sign in or check your internet connection.',
  },
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => getInitialLang());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  const value = useMemo(() => {
    const table = translations[lang] || translations[DEFAULT_LANG] || {};

    const t = (key) => table[key] || key;

    return {
      lang,
      setLang,
      t,
    };
  }, [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}
