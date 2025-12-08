// src/hooks/useProductDetail.js
import { useState, useEffect } from 'react';
import { getProductById } from '../api/products';

export default function useProductDetail(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || id === "undefined") {
      setError("Mahsulot ID si mavjud emas");
      setLoading(false);
      return;
    }

    let isCancelled = false;

    getProductById(id)
      .then((data) => {
        if (!isCancelled) {
          setProduct(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error("Mahsulot yuklanmadi:", err);
          setError("Mahsulot topilmadi yoki server xatosi");
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [id]);

  return { product, loading, error };
}   