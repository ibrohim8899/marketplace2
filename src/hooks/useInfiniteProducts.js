// // src/hooks/useInfiniteProducts.js
// import { useState, useEffect } from 'react';
// import { getProducts, getProductsByCategory, searchProducts } from '../api/products';

// export default function useInfiniteProducts({ category, searchQuery, priceRange }) {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [hasMore, setHasMore] = useState(false); // Pagination yo'q, lekin agar kerak bo'lsa qoldirdim
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         let data = [];

//         if (searchQuery) {
//           const res = await searchProducts(searchQuery);
//           data = res.results || res; // Oddiy holat
//         } else if (category) {
//           const res = await getProductsByCategory(category);
//           data = Array.isArray(res.results) ? res.results : res.results?.products || res || [];
//         } else {
//           // Barcha tovarlar – maxsus parsing
//           const res = await getProducts();
//           data = res.results?.products || res.results || res || []; // Backend o'zgargan formatga mos
//         }

//         setProducts(Array.isArray(data) ? data : []);
//         setHasMore(false); // Pagination yo'q
//       } catch (err) {
//         console.error("Xato:", err);
//         setError("Tovarlar yuklanmadi");
//         setProducts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [category, searchQuery, priceRange]);
// src/hooks/useInfiniteProducts.js
import { useState, useEffect } from 'react';
import { getProducts, getProductsByCategory, searchProducts, filterProductsByCost, filterProductsByLocation } from '../api/products';

export default function useInfiniteProducts({ category, searchQuery, priceRange, locationFilter }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let data;

        const hasSearch = !!searchQuery?.trim();
        const hasPriceRange = priceRange && priceRange.min != null && priceRange.max != null;
        const hasLocation = !!locationFilter?.trim();

        if (hasPriceRange) {
          console.log("Narx oralig'i bo'yicha yuklanmoqda:", priceRange);
          data = await filterProductsByCost({
            min: priceRange.min,
            max: priceRange.max,
            search: hasSearch ? searchQuery : undefined,
          });
        } else if (hasLocation) {
          console.log("Joylashuv bo'yicha yuklanmoqda:", locationFilter);
          data = await filterProductsByLocation({
            location: locationFilter,
            search: hasSearch ? searchQuery : undefined,
          });
        } else if (hasSearch) {
          console.log("Qidiruv bo'yicha yuklanmoqda:", searchQuery);
          data = await searchProducts(searchQuery);
        } else if (category && category !== "all") {
          console.log("Kategoriya bo'yicha yuklanmoqda:", category);
          data = await getProductsByCategory(category);
        } else {
          console.log("Barcha mahsulotlar yuklanmoqda");
          data = await getProducts();
        }

        // Har qanday formatdan to'g'ri massiv olish
        const list = Array.isArray(data) 
          ? data 
          : data?.results || data?.products || data || [];

        console.log("Yuklangan mahsulotlar soni:", list.length);
        setProducts(list);
      } catch (err) {
        console.error("useInfiniteProducts xatosi:", err);
        setError("Mahsulotlar yuklanmadi");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, searchQuery, priceRange, locationFilter]);

  // Pagination hozircha yo'q
  const loadMore = () => {};

  return {
    products,
    loading,
    hasMore: false,
    loadMore,
    error,
  };
}