// src/pages/ProductDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate qo‘shildi
import { getProductByUid } from "../api/products";
import { useCart } from "../context/CartContext"; // CartContext dan foydalanamiz
import ReviewList from "../components/review/ReviewList";
import ReviewForm from "../components/review/ReviewForm";
import Button from "../components/ui/Button";
import Container from "../components/layout/Container";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/common/EmptyState";
import ImageZoomModal from "../components/common/ImageZoomModal";

import {
  ChevronLeft,
  ChevronRight,
  Package,
  Star,
  ShoppingCart,
  MessageCircle,
  Percent,
  Maximize2,
  Heart,
  MapPin, // Qo‘shimcha: location uchun
  AlertCircle, // Qo‘shimcha: status uchun
  Calendar, // Qo‘shimcha: created_at uchun
} from "lucide-react";

export default function ProductDetailPage() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist, isInCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [refreshComments, setRefreshComments] = useState(0);

  useEffect(() => {
    // Agar id yo‘q yoki undefined bo‘lsa – bosh sahifaga qaytaramiz
    if (!uid || uid === "undefined") {
      navigate("/");
      return;
    }

    getProductByUid(uid)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [uid, navigate]);

  if (loading) return <LoadingSpinner />;
  if (!product) return <EmptyState message="Tovar topilmadi" />;

  // Backenddan 5 ta rasm olish (faqat mavjudlarini)
  const images = [];
  if (product.photo1) images.push(product.photo1);
  if (product.photo2) images.push(product.photo2);
  if (product.photo3) images.push(product.photo3);
  if (product.photo4) images.push(product.photo4);
  if (product.photo5) images.push(product.photo5);

  const hasMultipleImages = images.length > 1;
  const productId = product.uid || product.id;

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  const handleImageClick = () => setIsZoomModalOpen(true);

  // Tugmalar
  const handleAddToCart = () => addToCart(product);
  const handleToggleWishlist = () => toggleWishlist(product);

  return (
    <div className="pb-20 min-h-screen">
      {/* RASMLAR GALEREYASI */}
      <div className="relative bg-white">
        <div className="relative group cursor-pointer" onClick={handleImageClick}>
          <img
            src={images[currentImageIndex] || product.thumbnail || product.photo1}
            alt={product.title || product.name}
            className="w-full h-64 sm:h-80 md:h-96 lg:h-[520px] object-cover"
            loading="lazy"
          />

          <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-2 rounded-lg flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
            <Maximize2 className="w-4 h-4" />
            <span className="text-sm font-medium">Kattalashtirish</span>
          </div>

          {hasMultipleImages && (
            <>
              <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-xl z-10">
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-xl z-10">
                <ChevronRight className="w-6 h-6 text-gray-800" />
              </button>
            </>
          )}

          {hasMultipleImages && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                  className={`transition-all rounded-full ${i === currentImageIndex ? "bg-white w-10 h-2" : "bg-white/60 w-2 h-2"}`}
                />
              ))}
            </div>
          )}
        </div>

        {hasMultipleImages && (
          <div className="px-4 py-5 border-t">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`flex-shrink-0 w-20 lg:w-24 h-20 lg:h-24 rounded-xl overflow-hidden border-2 transition-all ${i === currentImageIndex ? "border-indigo-600 shadow-lg" : "border-gray-200"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Container className="mt-6 space-y-7">
        <div className="space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {product.title || product.name}
          </h1>

          <div className="flex items-center gap-6 flex-wrap">
            <p className="text-3xl font-bold text-green-600">
              {(product.cost || product.price || 0).toLocaleString()} so'm
            </p>

            {product.discountPercentage > 0 && (
              <div className="flex items-center gap-2 text-red-600">
                <Percent className="w-5 h-5" />
                <span className="font-bold text-lg">-{product.discountPercentage}%</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              {product.category || "Kategoriya"}
            </Badge>

            {(product.rating || product.rating === 0) && (
              <div className="flex items-center gap-1 text-gray-600">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span>{Number(product.rating).toFixed(1)}</span>
              </div>
            )}

            <div className="flex items-center gap-1 text-gray-600">
              <ShoppingCart className="w-4 h-4" />
              <span>
                {product.stock > 0 || product.amount > 0
                  ? `${product.stock || product.amount} dona qoldi`
                  : "Tugagan"}
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed text-base">
          {product.description || "Tavsif mavjud emas"}
        </p>

        {/* Qo‘shimcha backend ma’lumotlari (location, status, created_at) */}
        <div className="space-y-4 mt-8 pt-8 border-t">
          <h2 className="text-xl font-bold text-gray-800">Qo‘shimcha ma’lumotlar</h2>

          <div className="flex items-center gap-3 text-gray-600">
            <MapPin className="w-5 h-5 text-blue-500" />
            <span>
              Joylashuv: {product.location || "Joylashuv mavjud emas"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <AlertCircle className="w-5 h-5 text-green-500" />
            <span>
              Holati: {product.status || "Holati mavjud emas"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-gray-600">
            <Calendar className="w-5 h-5 text-purple-500" />
            <span>
              Yaratilgan vaqt: {new Date(product.created_at).toLocaleString() || "Vaqt mavjud emas"}
            </span>
          </div>
        </div>

        {/* Tugmalar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* <Button
            onClick={handleAddToCart}
            className="w-full py-4 text-lg font-bold flex items-center justify-center gap-3"
            variant={isInCart(productId) ? "secondary" : "default"}
          >
            <ShoppingCart className="w-6 h-6" />
            {isInCart(productId) ? "Savatchada" : "Savatchaga qo'shish"}
          </Button> */}

          <Button
            onClick={handleToggleWishlist}
            variant={isInWishlist(productId) ? "secondary" : "outline"}
            className={`group w-full py-3.5 text-base sm:text-lg font-semibold rounded-full border-2 flex items-center justify-center gap-2 sm:gap-3 transition-all duration-200 ${
              isInWishlist(productId)
                ? "bg-black-50 border-gray-200 text-black-600 hover:bg-black-500 hover:text-black-100 shadow-md"
                : "bg-white border-gray-200 text-black-500 hover:bg-black-50 hover:border-gray-100"
            }`}
          >
            <Heart
              className={`w-6 h-6 transition-transform duration-200 ${
                isInWishlist(productId)
                  ? "fill-rose-500 text-rose-500 group-hover:scale-105"
                  : "group-hover:scale-105"
              }`}
            />
            <span className="relative">
              {isInWishlist(productId) ? "Sevimlilardan o'chirish" : "Sevimlilarga"}
            </span>
          </Button>
        </div>

        {/* Sharhlar */}
        <div className="mt-10 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6">Sharhlar</h2>
          <ReviewForm 
            productId={uid} 
            onAdded={() => setRefreshComments(prev => prev + 1)}
          />
          <div className="mt-8">
            <ReviewList 
              productId={uid} 
              key={refreshComments}
              onCommentDeleted={() => setRefreshComments(prev => prev + 1)}
            />
          </div>
        </div>
      </Container>

      <ImageZoomModal
        isOpen={isZoomModalOpen}
        onClose={() => setIsZoomModalOpen(false)}
        images={images.length > 0 ? images : [product.thumbnail || product.photo1]}
        initialIndex={currentImageIndex}
      />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
