// src/components/product/ProductList.jsx
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import ProductCard from './ProductCard';
import useInfiniteProducts from '../../hooks/useInfiniteProducts';

export default function ProductList({ category, categoryFilter, searchQuery, priceRange, locationFilter }) {
  const { products, loading, hasMore, loadMore, error } = useInfiniteProducts({ 
    category: category || categoryFilter, 
    searchQuery, 
    priceRange,
    locationFilter,
  });

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadMore]);

  if (error) {
    return <div className="col-span-full text-center py-20 text-red-500 text-lg">{error}</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.uid} product={product} />
      ))}

      {loading && Array.from({ length: 8 }).map((_, i) => (
        <ProductCard key={`skeleton-${i}`} loading />
      ))}

      {hasMore && !searchQuery && (
        <div ref={ref} className="col-span-full h-10" />
      )}

      {!loading && products.length === 0 && (
        <div className="col-span-full text-center py-20 text-gray-500 text-lg">
          Bu filtr bo‘yicha tovar topilmadi
        </div>
      )}
    </div>
  );
}