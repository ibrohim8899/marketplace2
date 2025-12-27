// src/components/seller/SellerDashboard.jsx
import { useState, useEffect, useMemo } from 'react';

import { Link } from 'react-router-dom';
import { Upload, Package, DollarSign, MapPin, Tag, User, FileText, CheckCircle } from 'lucide-react';
import { getCategories } from '../../api/categories';
import { createProduct, getMyProducts, deleteProduct, partialUpdateProduct } from '../../api/products';
import axiosInstance from '../../api/axiosInstance';
import { useNotification } from '../../context/NotificationContext';

export default function SellerDashboard() {
  const { showNotification } = useNotification();
  const generateUid = () => {
    if (window?.crypto?.randomUUID) {
      return window.crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
  };

  const [form, setForm] = useState({
    uid: generateUid(),
    name: '',
    cost: '',
    amount: 1,
    category: '',
    description: '',
    location: '',
    status: 'pending',
  });

  const [editingUid, setEditingUid] = useState(null);

  const [photos, setPhotos] = useState([null, null, null, null, null]); // { file, preview }

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState(null);
  const [myProducts, setMyProducts] = useState([]);
  const [myProductsLoading, setMyProductsLoading] = useState(false);
  const [myProductsError, setMyProductsError] = useState(null);
  const [formError, setFormError] = useState(null);

  const [ownerInfo, setOwnerInfo] = useState(null);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [ownerError, setOwnerError] = useState(null);

  const isLoggedIn = !!localStorage.getItem('access_token');

  const loadMyProducts = async () => {
    if (!isLoggedIn) return;
    try {
      setMyProductsLoading(true);
      setMyProductsError(null);
      const data = await getMyProducts();
      const list = Array.isArray(data) ? data : data?.results || data || [];
      setMyProducts(list);
    } catch (err) {
      console.error('My products yuklanmadi:', err);
      setMyProductsError("Mahsulotlaringiz yuklanmadi");
    } finally {
      setMyProductsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    setCategoriesLoading(true);
    setCategoriesError(null);

    const fetchOwner = async () => {
      try {
        setOwnerLoading(true);
        setOwnerError(null);
        const { data } = await axiosInstance.get('/user/profile/');
        setOwnerInfo(data);
      } catch (err) {
        console.error('Profil ma\'lumotlari olinmadi:', err);
        setOwnerError("Profil ma'lumotlarini olishda xatolik");
      } finally {
        setOwnerLoading(false);
      }
    };

    fetchOwner();

    getCategories()
      .then((data) => {
        const cats = data.results || data;
        setCategories(cats);
      })
      .catch((err) => {
        console.error('Kategoriyalar yuklanmadi:', err);
        setCategoriesError('Kategoriyalar yuklanmadi');
      })
      .finally(() => {
        setCategoriesLoading(false);
      });

    loadMyProducts();
  }, [isLoggedIn]);

  const handlePhoto = (index, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setPhotos((prev) => {
      const next = [...prev];
      if (next[index]?.preview) {
        URL.revokeObjectURL(next[index].preview);
      }
      next[index] = { file, preview };
      return next;
    });
  };

  const resetPhotos = () => {
    photos.forEach((photo) => {
      if (photo?.preview) {
        URL.revokeObjectURL(photo.preview);
      }
    });
    setPhotos([null, null, null, null, null]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      showNotification({
        type: 'warning',
        title: 'Tizimga kiring',
        message: "Mahsulot joylash uchun avval akkauntingizga kiring.",
      });
      return;
    }

    if (!form.category) {
      setFormError("Iltimos, kategoriya tanlang.");
      return;
    }

    if (!ownerInfo?.uid && !ownerInfo?.id) {
      setFormError("Profil ma'lumotlari topilmadi. Sahifani yangilang.");
      return;
    }

    setLoading(true);
    setFormError(null);

    try {
      if (editingUid) {
        // Faqat asosiy maydonlarni yangilaymiz (rasmlarni hozircha o'zgartirmaymiz)
        const payload = {
          name: form.name,
          cost: String(form.cost),
          amount: String(form.amount),
          category: form.category,
          description: form.description,
          location: form.location,
          status: form.status,
        };

        await partialUpdateProduct(editingUid, payload);

        showNotification({
          type: 'success',
          title: 'Mahsulot yangilandi',
          message: "Mahsulot ma'lumotlari muvaffaqiyatli yangilandi.",
        });
      } else {
        const formData = new FormData();
        if (form.uid) formData.append("uid", form.uid);
        formData.append("name", form.name);
        formData.append("cost", String(form.cost));
        formData.append("amount", String(form.amount));

        const ownerUid = ownerInfo?.uid || ownerInfo?.id;
        if (!ownerUid) {
          throw new Error("Profil ma'lumotlari topilmadi. Ilova qayta ishga tushiring.");
        }
        formData.append("owner", ownerUid);

        formData.append("category", form.category);
        formData.append("description", form.description);
        formData.append("location", form.location);
        formData.append("status", form.status);

        photos.forEach((photo, index) => {
          if (photo?.file) {
            formData.append(`photo${index + 1}`, photo.file);
          }
        });

        await createProduct(formData);

        showNotification({
          type: 'success',
          title: "Mahsulot qo'shildi",
          message: 'Yangi mahsulotingiz tekshiruvga yuborildi.',
        });
      }

      setForm({
        uid: generateUid(),
        name: '',
        cost: '',
        amount: 1,
        category: '',
        description: '',
        location: '',
        status: 'pending',
      });
      resetPhotos();
      setEditingUid(null);

      await loadMyProducts();
    } catch (err) {
      const baseTitle = editingUid ? 'Mahsulotni yangilashda xato' : 'Mahsulot yaratishda xato';
      const baseDefault = editingUid ? 'Mahsulot yangilanmadi' : 'Mahsulot yaratilmadi';
      console.error(baseTitle + ':', err.response?.data || err.message);
      const detail = err.response?.data || err.message;
      if (typeof detail === 'string') {
        setFormError(detail);
      } else if (Array.isArray(detail)) {
        setFormError(detail.join(' \n'));
      } else if (detail && typeof detail === 'object') {
        const message = Object.entries(detail)
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
          .join('\n');
        setFormError(message || baseDefault);
      } else {
        setFormError(baseDefault);
      }
      showNotification({
        type: 'error',
        title: baseTitle,
        message: 'Iltimos, formadagi xabarni tekshiring.',
      });
    } finally {
      setLoading(false);
    }
  };

  const uidDisplay = useMemo(() => form.uid.slice(0, 8) + '…' + form.uid.slice(-4), [form.uid]);

  const startEdit = (product) => {
    const productUid = product.uid || product.id || form.uid;
    setEditingUid(productUid);
    setForm({
      uid: productUid,
      name: product.name || product.title || '',
      cost: String(product.cost || product.price || ''),
      amount: String(product.amount || product.stock || 1),
      category: product.category?.uid || product.category || '',
      description: product.description || '',
      location: product.location || '',
      status: product.status || 'pending',
    });
    setPhotos([null, null, null, null, null]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (uid) => {
    if (!uid) return;
    const confirmed = window.confirm("Rostdan ham bu mahsulotni o'chirmoqchimisiz?");
    if (!confirmed) return;

    try {
      await deleteProduct(uid);
      await loadMyProducts();
    } catch (err) {
      console.error("Mahsulot o'chirish xatosi:", err);
      showNotification({
        type: 'error',
        title: "Mahsulot o'chirilmadi",
        message: 'Qayta urinib ko\'ring yoki internetni tekshiring.',
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-6 space-y-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Mahsulot joylash uchun tizimga kiring</h1>
          <p className="text-sm text-gray-600">
            Bu bo'lim faqat tizimga kirgan foydalanuvchilar uchun. Iltimos, avval akkauntingizga kiring.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <Link
              to="/login"
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Tizimga kirish
            </Link>
            <Link
              to="/"
              className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Bosh sahifa
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-6">
      <div className="max-w-5xl mx-auto">
        {/* Sarlavha */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            {editingUid ? "Mahsulotni tahrirlash" : "Yangi Mahsulot Qo'shish"}
          </h1>
          <p className="text-gray-600">
            {editingUid
              ? "Tanlangan mahsulot ma'lumotlarini yangilang."
              : "Barcha maydonlarni to'ldiring va e'lon bering"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 space-y-8">
          {formError && (
            <div className="mb-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {formError}
            </div>
          )}

          {/* 1-qator: UID + Name */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Package className="w-4 h-4 text-blue-600" />
                UID <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 text-sm truncate">
                  {uidDisplay}
                </div>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, uid: generateUid() }))}
                  className="px-4 py-3 rounded-xl bg-blue-50 text-blue-600 text-sm font-semibold hover:bg-blue-100 transition-colors"
                >
                  UID yangilash
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Har bir mahsulot uchun noyob UID avtomatik yaratiladi.</p>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Tag className="w-4 h-4 text-green-600" />
                Mahsulot nomi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="iPhone 15 Pro Max"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* 2-qator: Narx + Miqdor */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="w-4 h-4 text-yellow-600" />
                Narxi (so'm) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                placeholder="12 990 000"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Package className="w-4 h-4 text-purple-600" />
                Miqdori <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                min="1"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* 3-qator: Ega + Kategoriya */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 text-indigo-600" />
                Ega <span className="text-red-500">*</span>
              </label>
              <div className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-800 text-sm">
                {ownerLoading
                  ? 'Profil ma\'lumotlari yuklanmoqda...'
                  : ownerError
                  ? ownerError
                  : ownerInfo?.name || ownerInfo?.username || ownerInfo?.email || "Ma'lumot yo'q"}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Tag className="w-4 h-4 text-pink-600" />
                Kategoriya <span className="text-red-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Tanlang</option>
                {categoriesLoading && (
                  <option disabled>Yuklanmoqda...</option>
                )}
                {!categoriesLoading && categoriesError && (
                  <option disabled>{categoriesError}</option>
                )}
                {!categoriesLoading && !categoriesError && categories.map((c) => (
                  <option key={c.uid} value={c.uid}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tavsif */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 text-teal-600" />
              Tavsif <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Mahsulot haqida batafsil ma'lumot..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
              required
            />
          </div>

          {/* Joylashuv */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 text-red-600" />
              Joylashuv <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Toshkent, Chilanzar tumani"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Holat */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <CheckCircle className="w-4 h-4 text-orange-600" />
              Holat <span className="text-red-500">*</span>
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="pending">Kutilmoqda</option>
              <option value="active">Faol</option>
              <option value="sold_out">Sotuv tugagan</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Upload className="w-4 h-4 text-purple-600" />
              Rasmlar (5 tagacha)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[0, 1, 2, 3, 4].map((index) => (
                <div key={index} className="relative group">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhoto(index, e)}
                      className="hidden"
                    />
                    <div className="aspect-square border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center hover:border-blue-500 transition-all bg-gray-50 group-hover:bg-blue-50">
                      {photos[index]?.preview ? (
                        <img
                          src={photos[index].preview}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mb-1" />
                          <span className="text-xs text-gray-500">Photo {index + 1}</span>
                        </>
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Tugma */}
          <button
            type="submit"
            disabled={loading}
            className="w-full text-white font-bold py-4 bg-blue-400 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Yuborilmoqda...
              </>
            ) : (
              <>
                <Package className="w-5 h-5" />
                {editingUid ? "Mahsulotni Yangilash" : "Mahsulotni Qo'shish"}
              </>
            )}
          </button>
        </form>

        <div className="mt-12 bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Mening mahsulotlarim</h2>
          </div>

          {myProductsLoading ? (
            <div className="py-6 text-center text-gray-500 text-sm">Mahsulotlaringiz yuklanmoqda...</div>
          ) : myProductsError ? (
            <div className="py-6 text-center text-red-500 text-sm">{myProductsError}</div>
          ) : myProducts.length === 0 ? (
            <div className="py-6 text-center text-gray-500 text-sm">Hozircha sizda joylashtirilgan mahsulotlar yo'q.</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {myProducts.map((p) => (
                <div
                  key={p.uid || p.id}
                  className="border border-gray-100 rounded-2xl p-4 flex items-start justify-between bg-gray-50/60 hover:bg-white hover:shadow-md transition-all"
                >
                  <div className="pr-3">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-1">
                      {p.name || p.title || 'Nomsiz mahsulot'}
                    </h3>
                    <p className="mt-1 text-sm text-gray-700">
                      {(p.cost || p.price || 0).toLocaleString()} so'm
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Holati: {p.status || 'Noma’lum'}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(p)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      Tahrirlash
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.uid || p.id)}
                      className="text-xs font-semibold text-red-500 hover:text-red-600 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      O'chirish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}