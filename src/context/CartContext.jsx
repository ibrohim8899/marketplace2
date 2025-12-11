// // src/context/CartContext.jsx
// import { createContext, useContext, useState, useEffect } from 'react';

// const CartContext = createContext();

// export function CartProvider({ children }) {
//   // Xavfsiz o‘qish funksiyasi
//   const safeParse = (item, fallback = []) => {
//     if (!item) return fallback;
//     try {
//       const parsed = JSON.parse(item);
//       return Array.isArray(parsed) ? parsed : fallback;
//     } catch (err) {
//       console.warn('Buzilgan localStorage maʼlumoti oʻchirildi:', err);
//       localStorage.removeItem('cart_v2');
//       localStorage.removeItem('wishlist_v2');
//       return fallback;
//     }
//   };

//   // Yuklash
//   useEffect(() => {
//     const savedCart = localStorage.getItem('cart_v2');
//     const savedWishlist = localStorage.getItem('wishlist_v2');

//     setCart(safeParse(savedCart));
//     setWishlist(safeParse(savedWishlist));
//   }, []);

//   // Saqlash
//   useEffect(() => {
//     try {
//       localStorage.setItem('cart_v2', JSON.stringify(cart));
//     } catch (err) {
//       console.error('Cart saqlanmadi:', err);
//     }
//   }, [cart]);

//   useEffect(() => {
//     try {
//       localStorage.setItem('wishlist_v2', JSON.stringify(wishlist));
//     } catch (err) {
//       console.error('Wishlist saqlanmadi:', err);
//     }
//   }, [wishlist]);

//   const addToCart = (product) => {
//     const id = product.uid || product.id || product._id;
//     if (!id) {
//       console.error('Mahsulotda ID yoʻq!', product);
//       return;
//     }

//     setCart(prev => {
//       const exists = prev.find(item => (item.uid || item.id || item._id) === id);
//       if (exists) {
//         return prev.map(item =>
//           (item.uid || item.id || item._id) === id
//             ? { ...item, quantity: item.quantity + 1 }
//             : item
//         );
//       }
//       return [...prev, { ...product, uid: id, quantity: 1 }];
//     });
//   };

//   const removeFromCart = (productId) => {
//     setCart(prev => prev.filter(item => (item.uid || item.id || item._id) !== productId));
//   };

//   const updateQuantity = (productId, newQty) => {
//     if (newQty <= 0) {
//       removeFromCart(productId);
//       return;
//     }
//     setCart(prev =>
//       prev.map(item =>
//         (item.uid || item.id || item._id) === productId
//           ? { ...item, quantity: newQty }
//           : item
//       )
//     );
//   };

//   const clearCart = () => setCart([]);

//   const toggleWishlist = (product) => {
//     const id = product.uid || product.id || product._id;
//     if (!id) return;

//     setWishlist(prev => {
//       const exists = prev.some(item => (item.uid || item.id || item._id) === id);
//       if (exists) {
//         return prev.filter(item => (item.uid || item.id || item._id) !== id);
//       }
//       return [...prev, { ...product, uid: id }];
//     });
//   };

//   const isInCart = (id) => cart.some(item => (item.uid || item.id || item._id) === id);
//   const isInWishlist = (id) => wishlist.some(item => (item.uid || item.id || item._id) === id);

//   const getTotalPrice = () => cart.reduce((sum, item) => {
//     const price = Number(item.cost || item.price || 0);
//     return sum + price * item.quantity;
//   }, 0);

//   const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);

//   const value = {
//     cart,
//     wishlist,
//     addToCart,
//     removeFromCart,
//     updateQuantity,
//     clearCart,
//     toggleWishlist,
//     isInCart,
//     isInWishlist,
//     getTotalPrice,
//     getTotalItems,
//   };

//   return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
// }

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) throw new Error('useCart must be used within CartProvider');
//   return context;
// };

import { createContext, useContext, useState, useEffect } from 'react';
import { getCartItems, addToCartApi, removeFromCartApi } from '../api/cart';
import { useNotification } from './NotificationContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  // Xavfsiz o'qish va ma'lumotni filtrlash
  const safeParse = (item, fallback = []) => {
    if (!item) return fallback;
    try {
      const parsed = JSON.parse(item);
      // Qayta yuklashda ID ni barcha ehtimoliy nomlar bilan tekshirish
      return Array.isArray(parsed) 
            ? parsed.filter(p => p.id || p.uid || p._id || p.product_uid) 
            : fallback;
    } catch (err) {
      console.error('Wishlistni oqishda xatolik:', err);
      return fallback;
    }
  };

  // --- WISHLIST LOGIKASI (LOCAL STORAGE) ---
  // Refreshda localStorage dan yuklash
  const { showNotification } = useNotification();

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist_v2');
    return safeParse(saved);
  });

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Wishlistni saqlash (wishlist o'zgarganda localStorage ga yozish)
  // BU QISM LOCAL STORAGE ISHLASHINI TA'MINLAYDI
  useEffect(() => {
    try {
      localStorage.setItem('wishlist_v2', JSON.stringify(wishlist));
    } catch (err) {
      console.error('Wishlist localStoragega saqlanmadi:', err);
    }
  }, [wishlist]);

  // Savatchani yangilash funksiyasi
  const fetchCart = async () => {
    setLoading(true);
    try {
      const items = await getCartItems();
      setCart(items);
    } catch (error) {
      console.log("Savatchani yuklash imkoni bo'lmadi (Login qilinmagan bo'lishi mumkin)");
      setCart([]); 
    } finally {
      setLoading(false);
    }
  };

  // Ilovaga kirganda savatchani API dan yuklash
  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (product) => {
    try {
      await addToCartApi(product);
      await fetchCart();
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Savatchaga qo\'shib bo\'lmadi',
        message: "Tizimga kiring yoki internet aloqasini tekshiring.",
      });
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await removeFromCartApi(productId);
      await fetchCart();
    } catch (error) {
      console.error("O'chirishda xatolik", error);
      fetchCart(); 
    }
  };

  const updateQuantity = async (productId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prev => prev.map(item => {
      const itemUid = item.product_uid || item.uid || (item.product?.uid);
      if (itemUid === productId) {
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setCart([]);
  };

  /**
   * Wishlist funksiyasi. Barcha turdagi ID ni topadi va universal 'id' kaliti ostida saqlaydi.
   */
  const toggleWishlist = (product) => {
    // Barcha ehtimoliy ID kalitlarini tekshirish
    const id = product.id || product.uid || product._id || product.product_uid; 
    
    if (!id) {
      console.warn('Mahsulotda ID yo‘q, wishlistga qo‘shib bo‘lmadi:', product);
      return;
    }

    setWishlist(prev => {
      // Tekshiruvda universal 'id' kalitidan foydalanish
      const exists = prev.some(item => item.id === id); 
      
      if (exists) {
        // O'chirish
        const updated = prev.filter(item => item.id !== id);
        // localStorage ga yozish
        try {
          localStorage.setItem('wishlist_v2', JSON.stringify(updated));
        } catch (err) {
          console.error('Wishlist localStoragega saqlanmadi:', err);
        }
        return updated;
      }
      
      // Qo'shish: Ma'lumotni universal 'id' kaliti bilan standartlashtirish
      const updated = [...prev, { ...product, id: id }];
      // localStorage ga yozish
      try {
        localStorage.setItem('wishlist_v2', JSON.stringify(updated));
      } catch (err) {
        console.error('Wishlist localStoragega saqlanmadi:', err);
      }
      return updated;
    });
  };

  // Yordamchi funksiyalar
  const getItemId = (item) => item.product_uid || item.uid || (item.product?.uid);

  const isInCart = (id) => cart.some(item => getItemId(item) === id);

  // Wishlistda tekshirish: faqat 'id' kalitini tekshirish (chunki u standartlashtirilgan)
  const isInWishlist = (id) => wishlist.some(item => item.id === id);

  const getTotalPrice = () => cart.reduce((sum, item) => {
    const product = item.product || item;
    const price = Number(product.cost || product.price || 0);
    const qty = item.quantity || 1;
    return sum + price * qty;
  }, 0);

  const getTotalItems = () => cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const value = {
    cart,
    wishlist,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleWishlist,
    isInCart,
    isInWishlist,
    getTotalPrice,
    getTotalItems,
    fetchCart 
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};