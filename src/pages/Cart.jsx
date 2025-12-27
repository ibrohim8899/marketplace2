// src/pages/Cart.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Search, Filter, X } from 'lucide-react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceSort, setPriceSort] = useState('none');
  const [showFilters, setShowFilters] = useState(false);

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-8 bg-gray-50">
        <div className="text-center space-y-6">
          <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Savatcha bo'sh</h2>
          <p className="text-gray-600">Mahsulotlarni qo'shib boshlang!</p>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Xarid qilishni boshlash
          </Link>
        </div>
      </div>
    );
  }

  // DIQQAT: API dan kelgan ma'lumot ichida product object borligiga ishonch hosil qilish kerak.
  // Contextda buni to'g'irlab ketdik.
  const categories = ['all', ...new Set(cart.map(item => item.product?.category || 'Noma\'lum'))];

  const filteredCart = cart
    .filter(item => {
      const product = item.product || {};
      const title = (product.name || product.title || '').toLowerCase();
      const matchesSearch = title.includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const priceA = Number(a.product?.cost || a.product?.price || 0);
      const priceB = Number(b.product?.cost || b.product?.price || 0);
      if (priceSort === 'low-high') return priceA - priceB;
      if (priceSort === 'high-low') return priceB - priceA;
      return 0;
    });

  const filteredTotalPrice = filteredCart.reduce((total, item) => {
    const price = Number(item.product?.cost || item.product?.price || 0);
    // Agar API quantity qaytarmasa, default 1 deb olamiz
    const qty = item.quantity || 1;
    return total + price * qty;
  }, 0);

  const filteredTotalItems = filteredCart.reduce((total, item) => total + (item.quantity || 1), 0);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setPriceSort('none');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || priceSort !== 'none';

  return (
    <div>
      <div className="max-w-4xl mx-auto px-4 py-6">

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Savatcha ({getTotalItems()} ta mahsulot)
          </h1>
          <button onClick={clearCart} className="text-sm text-red-600 hover:text-red-700 font-medium">
            Hammasini o'chirish
          </button>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden w-full flex items-center justify-center gap-2 bg-white rounded-lg px-4 py-3 mb-4 shadow-sm border border-gray-200"
        >
          <Filter className="w-5 h-5" />
          <span className="font-medium">Filtrlar</span>
          {hasActiveFilters && <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">Aktiv</span>}
        </button>

        <div className={`bg-white rounded-xl shadow-sm p-4 mb-6 space-y-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Mahsulot qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategoriya</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat === 'all' ? 'Hammasi' : cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Narx bo'yicha</label>
              <select value={priceSort} onChange={(e) => setPriceSort(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="none">Saralash</option>
                <option value="low-high">Arzon to Qimmat</option>
                <option value="high-low">Qimmat to Arzon</option>
              </select>
            </div>

            <div className="flex items-end">
              {hasActiveFilters && (
                <button onClick={clearFilters} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                  <X className="w-4 h-4" /> Tozalash
                </button>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-600 pt-2 border-t">
            {filteredCart.length} ta topildi {hasActiveFilters && `(${cart.length} tadan)`}
          </div>
        </div>

        {filteredCart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500 text-lg">Hech narsa topilmadi</p>
            <button onClick={clearFilters} className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Filtrlarni tozalash
            </button>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {filteredCart.map((item) => {
              const product = item.product || {};
              // API ba'zan 'uid', ba'zan 'product_uid' qaytarishi mumkin, ikkalasini tekshiramiz
              const productId = product.uid || item.uid || item.product_uid || item.id;

              if (!productId) return null;

              return (
                <div 
                  key={productId}
                  className="bg-white rounded-xl shadow-sm p-4 flex gap-4 hover:shadow-md transition-shadow"
                >
                  <Link to={`/product/${productId}`} className="flex-shrink-0">
                    <img
                      src={product.photo1 || product.thumbnail || '/placeholder.jpg'}
                      alt={product.name || product.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${productId}`}>
                      <h3 className="font-semibold text-gray-800 mb-1 hover:text-blue-600 line-clamp-2">
                        {product.name || product.title || 'Nomsiz'}
                      </h3>
                    </Link>

                    <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded mb-2">
                      {product.category || 'Kategoriya yo‘q'}
                    </span>

                    <p className="text-green-600 font-bold text-lg mb-3">
                      {(Number(product.cost) || Number(product.price) || 0).toLocaleString()} so'm
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(productId, (item.quantity || 1) - 1)} className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity || 1}</span>
                        <button onClick={() => updateQuantity(productId, (item.quantity || 1) + 1)} className="p-1 rounded-lg bg-gray-100 hover:bg-gray-200">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button onClick={() => removeFromCart(productId)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredCart.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex justify-between text-lg">
              <span className="text-gray-600">Jami:</span>
              <span className="font-semibold">{filteredTotalItems} ta</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-4">
              <span>Jami narx:</span>
              <span className="text-green-600">{filteredTotalPrice.toLocaleString()} so'm</span>
            </div>
            <button className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg">
              Buyurtma berish ({filteredTotalItems} ta)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}