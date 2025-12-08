// // src/hooks/useProducts.js
// import { useState, useEffect } from 'react';
// import { getAllProducts, getRecommendedProducts } from '../api/products';

// export function useAllProducts() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     getAllProducts()
//       .then(data => {
//         const list = (data.results || data || []).filter(Boolean);
//         setProducts(list);
//       })
//       .catch(err => {
//         console.error("Mahsulotlar yuklanmadi:", err);
//         setError("Tovarlar yuklanmadi");
//         setProducts([]);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   return { products, loading, error };
// }

// export function useRecommendedProducts() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getRecommendedProducts()
//       .then(setProducts)
//       .catch(err => {
//         console.error("Tavsiya etilganlar yuklanmadi:", err);
//         setProducts([]);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   return { products, loading };
// }

// export function useProductByUid(uid) {
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!uid) {
//       setError("UID yo'q");
//       setLoading(false);
//       return;
//     }

//     import('../api/products')
//       .then(module => module.getProductByUid(uid))
//       .then(setProduct)
//       .catch(err => {
//         console.error("Mahsulot yuklanmadi:", err);
//         setError("Mahsulot topilmadi");
//       })
//       .finally(() => setLoading(false));
//   }, [uid]);

//   return { product, loading, error };
// }