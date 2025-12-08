// src/components/product/ProductCard.jsx
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";
import Skeleton from "../ui/Skeleton";

export default function ProductCard({ product, loading = false }) {
  const { addToCart, isInCart, toggleWishlist, wishlist = [] } = useCart();

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
        <Skeleton className="w-full h-64" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  const {
    uid,
    name,
    title,
    cost,
    price,
    amount,
    stock,
    photo1,
    thumbnail,
    rating,
    discountPercentage,
  } = product;

  const productId = uid || product.id;
  const inCart = productId ? isInCart?.(productId) : false;
  const inWishlist = productId
    ? wishlist.some((item) => item.id === productId)
    : false;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <Link
      to={`/product/${productId}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-300"
    >
      {/* Rasm container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={photo1 || thumbnail}
          alt={name || title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 "
        />

        {/* Chegirma badge */}
        {discountPercentage && discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-0.5 rounded-md text-xs font-semibold">
            -{discountPercentage}%
          </div>
        )}

        {/* Sevimlilar tugmasi */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
            inWishlist
              ? "bg-red-500 text-white"
              : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-red-500 hover:text-white"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`}
          />
        </button>
      </div>

      {/* Ma'lumotlar qismi */}
      <div className="p-3 space-y-2">
        {/* Mahsulot nomi */}
        <h3 className="text-gray-800 font-medium text-sm line-clamp-2 leading-tight">
          {name || title || "Nomsiz mahsulot"}
        </h3>

        {/* Narx va Stock - yonma-yon */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-gray-900">
              {(cost || price).toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">so'm</span>
          </div>
          
          {(amount || stock) > 0 && (
            <span className="text-xs text-gray-400">
              {amount || stock} ta
            </span>
          )}
        </div>

        {/* Rating */}
        {rating && (
          <div className="flex items-center">
            <span className="text-xs text-amber-500 font-medium">
              ★ {rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Commentariya tugmasi */}
        {/* <button
          onClick={handleAddToCart}
          className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-1.5 ${
            inCart
              ? "bg-green-50 text-green-600 border border-green-200"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {inCart ? (
            <>
              <Check className="w-4 h-4" />
              Savatchada
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" />
              Savatchaga
            </>
          )}
        </button> */}
      </div>
    </Link>
  );
}