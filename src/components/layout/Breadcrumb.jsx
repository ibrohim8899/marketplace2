// src/components/layout/Breadcrumb.jsx
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { getProducts } from '../../api/products';
import { getCategoryById } from '../../api/categories';
import { useLanguage } from '../../context/LanguageContext';

export default function Breadcrumb() {
  const location = useLocation();
  const [productName, setProductName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const { t } = useLanguage();

  // Yo'lni bo'laklarga ajratish
  const pathnames = location.pathname.split('/').filter(x => x);
  const productIndex = pathnames.indexOf('product');
  const productUid = productIndex !== -1 && pathnames[productIndex + 1]
    ? pathnames[productIndex + 1]
    : null;
  const categoryIndex = pathnames.indexOf('category');
  const categoryUid = categoryIndex !== -1 && pathnames[categoryIndex + 1]
    ? pathnames[categoryIndex + 1]
    : null;

  useEffect(() => {
    const loadProductName = async () => {
      try {
        if (!productUid) {
          setProductName('');
          return;
        }

        const data = await getProducts();
        const list = Array.isArray(data) ? data : data.results || data.products || [];
        const found = list.find((p) => p.uid === productUid);
        setProductName(found ? (found.name || found.title || '') : '');
      } catch (err) {
        console.error('Breadcrumb product name yuklanmadi:', err);
        setProductName('');
      }
    };

    loadProductName();
  }, [productUid]);

  useEffect(() => {
    const loadCategoryName = async () => {
      try {
        if (!categoryUid) {
          setCategoryName('');
          return;
        }

        // Maxsus "all" kategoriyasi uchun oddiy nom
        if (categoryUid === 'all') {
          setCategoryName(t('breadcrumb_all'));
          return;
        }

        const data = await getCategoryById(categoryUid);
        setCategoryName(data.name || '');
      } catch (err) {
        console.error('Breadcrumb category name yuklanmadi:', err);
        setCategoryName('');
      }
    };

    loadCategoryName();
  }, [categoryUid, t]);

  // Agar bosh sahifada bo'lsa, breadcrumb ko'rsatmaymiz
  if (pathnames.length === 0) {
    return null;
  }

  // Kategoriya nomlari (fallback uchun, agar API dan nom kelmasa)
  const categoryNames = {
    'electronics': 'Elektronika',
    'fashion': 'Moda',
    'books': 'Kitoblar',
    'home': 'Uy-ro\'zg\'or',
    'sports': 'Sport',
    'toys': 'O\'yinchoqlar',
    'food': 'Oziq-ovqat',
  };

  // Sahifa nomlari
  const pageNames = {
    'seller': t('breadcrumb_seller'),
    'top-sellers': t('breadcrumb_top_sellers'),
    'search': t('breadcrumb_search_results'),
    'profile': t('breadcrumb_profile'),
    'category': t('breadcrumb_category'),
    'product': t('breadcrumb_product'),
  };

  // Har bir segment uchun nom va link yaratish
  const getBreadcrumbItem = (segment, index) => {
    const prevSegment = index > 0 ? pathnames[index - 1] : null;
    const nextSegment = index < pathnames.length - 1 ? pathnames[index + 1] : null;
    let displayName = segment;
    let linkTo = `/${pathnames.slice(0, index + 1).join('/')}`;
    let shouldHideFromPath = false;
    let isClickable = true;

    // "category" so'zi uchun
    if (segment === 'category') {
      shouldHideFromPath = true;
      isClickable = false; // Bosilmaydigan qilamiz
    }
    // "product" so'zi uchun
    else if (segment === 'product') {
      shouldHideFromPath = true;
      isClickable = false; // Bosilmaydigan qilamiz
    }
    // Kategoriya parametri uchun
    else if (prevSegment === 'category') {
      if (categoryUid && segment === categoryUid) {
        displayName = categoryName || t('breadcrumb_category');
      } else {
        displayName = categoryNames[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
      }
      // Kategoriyaga link - /category/:uid formatida
      linkTo = `/category/${segment}`;
    }
    // Mahsulot UID uchun
    else if (prevSegment === 'product' && segment === productUid) {
      displayName = productName || t('breadcrumb_product');
      // Mahsulotga link - /product/:uid formatida
      linkTo = `/product/${segment}`;
    }
    // Boshqa parametrlar uchun
    else if (pageNames[segment]) {
      displayName = pageNames[segment];
    }
    // Agar mapping bo'lmasa, capitalize qilamiz
    else {
      displayName = segment.charAt(0).toUpperCase() + segment.slice(1);
    }

    // Oxirgi bo'lak /product/:uid yoki /category/:uid bo'lsa, har doim nomni ishlatamiz
    const isLast = index === pathnames.length - 1;
    if (isLast && productUid && segment === productUid) {
      displayName = productName || t('breadcrumb_product');
      linkTo = `/product/${segment}`;
    } else if (isLast && categoryUid && segment === categoryUid) {
      displayName = categoryName || t('breadcrumb_category');
      linkTo = `/category/${segment}`;
    }

    return { displayName, linkTo, shouldHideFromPath, isClickable };
  };

  return (
    <nav className="bg-gray-50 dark:bg-slate-950/95">

      <div className="max-w-screen-md mx-auto px-4 border-b border-gray-200 dark:border-slate-800">

        <ol className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide text-xs">
          {/* Bosh sahifa */}
          <li className="flex items-center flex-shrink-0">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-2 py-1 rounded-full text-gray-600 hover:text-blue-600 dark:text-slate-200 dark:hover:text-indigo-300 transition-all duration-200 font-medium group border border-gray-200 hover:bg-gray-100 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:bg-slate-800/90 dark:hover:border-indigo-500"
            >
              <Home className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span className="text-[11px]">{t('breadcrumb_home')}</span>
            </Link>
          </li>

          {/* Dinamik yo'l bo'laklari */}
          {pathnames.map((segment, index) => {
            const { displayName, linkTo, shouldHideFromPath } = getBreadcrumbItem(segment, index);
            // "category" va "product" so'zlarini ko'rsatmaymiz
            if (shouldHideFromPath) {
              return null;
            }
            const isLast = index === pathnames.length - 1;
            return (
              <li key={index} className="flex items-center flex-shrink-0">
                <ChevronRight className="w-3 h-3 text-gray-400 dark:text-slate-500 mx-0.5 flex-shrink-0" />
                {isLast ? (
                  <span className="text-[11px] text-gray-900 dark:text-slate-50 font-semibold px-2.5 py-1 bg-gray-50 dark:bg-slate-900 rounded-full border border-gray-200 dark:border-slate-700">
                    {displayName}
                  </span>
                ) : (
                  <Link
                    to={linkTo}
                    className="text-[11px] text-gray-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-indigo-300 transition-all duration-200 font-medium px-2 py-1 rounded-full border border-gray-200 hover:bg-gray-100 hover:border-blue-300 dark:border-slate-700 dark:hover:bg-slate-800/90 dark:hover:border-indigo-500"
                  >
                    {displayName}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}