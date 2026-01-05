
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
        const hasCategory = !!category?.trim();
        const hasPriceRange = priceRange && priceRange.min != null && priceRange.max != null;
        const hasLocation = !!locationFilter?.trim();

        // Priority: price > location > category > search > all
        if (hasPriceRange) {
          console.log("Narx oralig'i bo'yicha yuklanmoqda:", priceRange);
          data = await filterProductsByCost({
            min: priceRange.min,
            max: priceRange.max,
          });
        } else if (hasLocation) {
          console.log("Joylashuv bo'yicha yuklanmoqda:", locationFilter);
          data = await filterProductsByLocation({
            location: locationFilter,
          });
        } else if (hasCategory) {
          console.log("Kategoriya bo'yicha yuklanmoqda:", category);
          data = await getProductsByCategory(category);
        } else if (hasSearch) {
          console.log("Qidiruv bo'yicha yuklanmoqda:", searchQuery);
          data = await searchProducts(searchQuery);
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