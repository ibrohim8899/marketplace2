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

    profile_login_required: "Profil ma'lumotlarini ko'rish uchun tizimga kiring.",
    profile_empty_title: "Profil ma'lumotlari mavjud emas",
    profile_empty_desc: "Ilova imkoniyatlaridan foydalanish uchun tizimga kiring.",
    profile_loading: "Profil ma'lumotlari yuklanmoqda...",
    profile_name_fallback: "Ism ko'rsatilmagan",
    profile_status_active: 'Faol foydalanuvchi',
    profile_status_inactive: 'Nofaol',
    profile_last_activity_label: 'Oxirgi faoliyat:',
    profile_label_email: 'Email',
    profile_label_phone: 'Telefon',
    profile_label_username: "Foydalanuvchi nomi",
    profile_label_role: 'Role',
    profile_role_unknown: 'Aniqlanmagan',
    profile_registered_at: "Ro'yxatdan o'tgan vaqt",
    profile_telegram_id: 'Telegram ID',
    profile_extra_info_title: "Qo'shimcha ma'lumotlar",
    profile_logout: 'Chiqish',
    profile_load_failed: "Profilni yuklab bo'lmadi.",
    profile_go_login_button: "Kirish sahifasiga o'tish",

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

    seller_login_required_title: 'Mahsulot joylash uchun tizimga kiring',
    seller_login_required_desc:
      "Bu bo'lim faqat tizimga kirgan foydalanuvchilar uchun. Iltimos, avval akkauntingizga kiring.",
    seller_login_button: 'Tizimga kirish',
    seller_back_home: 'Bosh sahifa',

    cart_add_error_title: "Savatchaga qo'shib bo'lmadi",
    cart_add_error_message: 'Tizimga kiring yoki internet aloqasini tekshiring.',
    product_not_found: 'Tovar topilmadi',
    zoom_in: 'Kattalashtirish',
    currency_som: "so'm",
    category_label: 'Kategoriya',
    unit_piece: 'dona',
    left: 'qoldi',
    out_of_stock: 'Tugagan',
    description_not_available: 'Tavsif mavjud emas',
    additional_info: 'Qo‘shimcha ma’lumotlar',
    seller_label: 'Sotuvchi',
    contact_seller: "Sotuvchi bilan bog'lanish",
    location_label: 'Joylashuv',
    status_label: 'Holati',
    created_at_label: 'Yaratilgan vaqt',
    not_available: 'Mavjud emas',
    add_to_wishlist: 'Sevimlilarga',
    remove_from_wishlist: "Sevimlilardan o'chirish",
    reviews_title: 'Sharhlar',
    wishlist_empty_title: "Sevimlilar bo'sh",
    wishlist_empty_desc: "Yoqtirgan mahsulotlaringizni saqlab qo'ying!",
    view_products: "Mahsulotlarni ko'rish",
    wishlist_title: 'Sevimlilar',
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

    profile_login_required: 'Войдите в систему, чтобы просмотреть данные профиля.',
    profile_empty_title: 'Данные профиля отсутствуют',
    profile_empty_desc: 'Чтобы пользоваться всеми возможностями приложения, войдите в систему.',
    profile_loading: 'Данные профиля загружаются...',
    profile_name_fallback: 'Имя не указано',
    profile_status_active: 'Активный пользователь',
    profile_status_inactive: 'Неактивный',
    profile_last_activity_label: 'Последняя активность:',
    profile_label_email: 'Email',
    profile_label_phone: 'Телефон',
    profile_label_username: 'Имя пользователя',
    profile_label_role: 'Роль',
    profile_role_unknown: 'Не определено',
    profile_registered_at: 'Дата регистрации',
    profile_telegram_id: 'Telegram ID',
    profile_extra_info_title: 'Дополнительная информация',
    profile_logout: 'Выйти',
    profile_load_failed: 'Не удалось загрузить профиль.',
    profile_go_login_button: 'Перейти на страницу входа',

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

    seller_login_required_title: 'Войдите в систему, чтобы разместить товар',
    seller_login_required_desc:
      'Этот раздел доступен только авторизованным пользователям. Пожалуйста, сначала войдите в свой аккаунт.',
    seller_login_button: 'Войти',
    seller_back_home: 'Главная',

    cart_add_error_title: 'Не удалось добавить в корзину',
    cart_add_error_message: 'Войдите в систему или проверьте интернет-соединение.',
    product_not_found: 'Товар не найден',
    zoom_in: 'Увеличить',
    currency_som: 'сум',
    category_label: 'Категория',
    unit_piece: 'шт',
    left: 'осталось',
    out_of_stock: 'Нет в наличии',
    description_not_available: 'Описание отсутствует',
    additional_info: 'Дополнительная информация',
    seller_label: 'Продавец',
    contact_seller: 'Связаться с продавцом',
    location_label: 'Местоположение',
    status_label: 'Статус',
    created_at_label: 'Создан',
    not_available: 'Не указано',
    add_to_wishlist: 'В избранное',
    remove_from_wishlist: 'Убрать из избранного',
    reviews_title: 'Отзывы',
    wishlist_empty_title: 'Избранное пусто',
    wishlist_empty_desc: 'Сохраняйте понравившиеся товары!',
    view_products: 'Посмотреть товары',
    wishlist_title: 'Избранное',
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

    profile_login_required: 'Please sign in to view profile information.',
    profile_empty_title: 'Profile information is not available',
    profile_empty_desc: 'Sign in to use all features of the app.',
    profile_loading: 'Loading profile information...',
    profile_name_fallback: 'Name is not specified',
    profile_status_active: 'Active user',
    profile_status_inactive: 'Inactive',
    profile_last_activity_label: 'Last activity:',
    profile_label_email: 'Email',
    profile_label_phone: 'Phone',
    profile_label_username: 'Username',
    profile_label_role: 'Role',
    profile_role_unknown: 'Unknown',
    profile_registered_at: 'Registered at',
    profile_telegram_id: 'Telegram ID',
    profile_extra_info_title: 'Additional information',
    profile_logout: 'Log out',
    profile_load_failed: 'Failed to load profile.',
    profile_go_login_button: 'Go to login page',

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

    seller_login_required_title: 'Sign in to post a product',
    seller_login_required_desc:
      'This section is only available for logged-in users. Please sign in to your account first.',
    seller_login_button: 'Sign in',
    seller_back_home: 'Home',

    cart_add_error_title: 'Could not add to cart',
    cart_add_error_message: 'Sign in or check your internet connection.',
    product_not_found: 'Product not found',
    zoom_in: 'Zoom in',
    currency_som: 'UZS',
    category_label: 'Category',
    unit_piece: 'pcs',
    left: 'left',
    out_of_stock: 'Out of stock',
    description_not_available: 'Description not available',
    additional_info: 'Additional information',
    seller_label: 'Seller',
    contact_seller: 'Contact seller',
    location_label: 'Location',
    status_label: 'Status',
    created_at_label: 'Created at',
    not_available: 'Not available',
    add_to_wishlist: 'Add to wishlist',
    remove_from_wishlist: 'Remove from wishlist',
    reviews_title: 'Reviews',
    wishlist_empty_title: 'Wishlist is empty',
    wishlist_empty_desc: 'Save products you like!',
    view_products: 'Browse products',
    wishlist_title: 'Wishlist',
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
