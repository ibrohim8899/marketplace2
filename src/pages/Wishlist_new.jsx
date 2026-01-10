// src/pages/Wishlist.jsx
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Heart, Trash2, ArrowLeft } from 'lucide-react';

export default function Wishlist() {
  const { wishlist, toggleWishlist, isInCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-8 bg-gray-50 dark:bg-slate-950">
        <div className="text-center space-y-6">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-pink-100 to-red-100 rounded-full flex items-center justify-center">
            <Heart className="w-16 h-16 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Sevimlilar bo'sh</h2>
          <p className="text-gray-600">Yoqtirgan mahsulotlaringizni saqlab qo'ying!</p>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Mahsulotlarni ko'rish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="max-w-screen-md mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <Heart className="w-8 h-8 text-red-500 fill-current" />
          <h1 className="text-2xl font-bold text-gray-800">
            Sevimlilar ({wishlist.length})
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {wishlist.map((product) => {
            const productId = product.id;
            if (!productId) return null;
            
            const inCart = isInCart(productId);
            const price = product.cost || product.price || 0;

            return (
              <div 
                key={productId}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col relative group"
              >
                <Link to={`/product/${productId}`}>
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={product.photo1 || product.thumbnail}
                      alt={product.name || product.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                      }}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white text-red-500 shadow-lg transition-all hover:scale-110"
                      aria-label="Sevimlilardan o'chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {product.discountPercentage > 0 && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                        -{product.discountPercentage}%
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-3 flex flex-col justify-between flex-1">
                  <Link to={`/product/${productId}`}>
                    <h3
                      className="font-semibold text-sm truncate hover:text-blue-600"
                      title={product.name || product.title}
                    >
                      {product.name || product.title}
                    </h3>
                  </Link>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="text-green-600 font-bold text-lg">
                        {price > 0 ? `${price} so'm` : "Narxi yo'q"}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        {product.rating && <span>⭐ {product.rating.toFixed(1)}</span>}
                        {(product.amount || product.stock) && (
                          <span>{product.amount || product.stock} dona</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
