// src/components/product/RecommendedProducts.jsx
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { getProducts } from '../../api/products';

export default function RecommendedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const data = await getProducts();
        const list = Array.isArray(data)
          ? data
          : data?.results?.products || data?.results || data?.products || [];

        // Random 8 ta
        const shuffled = [...list].sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 8));
      } catch (err) {
        console.error("Tavsiya etilganlar yuklanmadi:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCard key={`sk-${i}`} loading />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <div className="text-center py-12 text-gray-500">Tavsiya yo‘q</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.uid} product={product} />
      ))}
    </div>
  );
}