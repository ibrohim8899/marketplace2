// // src/components/seller/SellerDashboard.jsx
// import { useState } from 'react';
// import AddProductForm from './AddProductForm';
// import Modal from '../ui/Modal';
// import Button from '../ui/Button';

// export default function SellerDashboard() {
//   const [showModal, setShowModal] = useState(false);

//   const handleAddProduct = (product) => {
//     console.log('Yangi tovar:', product);
//     setShowModal(false);
//     // Real backendga jo'natish
//   };

//   return (
//     <div className="pt-16 pb-20 p-4">
//       <h1 className="text-2xl font-bold mb-6">Sotuvchi Paneli</h1>
//       <Button onClick={() => setShowModal(true)} className="mb-6 w-full">Yangi tovar qo'shish</Button>
//       {/* Sotilgan tovarlar ro'yxati va boshqalar */}
//       <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
//         <h2 className="text-xl font-bold mb-4">Yangi Tovar</h2>
//         <AddProductForm onSubmit={handleAddProduct} />
//       </Modal>
//     </div>
//   );
// }

// src/components/seller/SellerDashboard.jsx
import { useState } from 'react';
import { Upload, Package, DollarSign, MapPin, Tag, User, FileText, CheckCircle } from 'lucide-react';

export default function SellerDashboard() {
  const [form, setForm] = useState({
    uid: '',
    name: '',
    cost: '',
    amount: 1,
    owner: '',
    category: '',
    description: '',
    location: '',
    status: 'PENDING',
  });

  const [photos, setPhotos] = useState([null, null, null, null, null]);
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 1, name: 'Smartfonlar' },
    { id: 2, name: 'Noutbuklar' },
    { id: 3, name: 'Kiyim-kechak' },
  ];

  const owners = [
    { id: 1, name: 'Ali Valiyev' },
    { id: 2, name: 'Olimjon Karimov' },
  ];

  const handlePhoto = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhotos = [...photos];
        newPhotos[index] = reader.result;
        setPhotos(newPhotos);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert('Mahsulot muvaffaqiyatli qo\'shildi!');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen from-blue-50 via-white to-purple-50 pt-16 pb-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Sarlavha */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Yangi Mahsulot Qo'shish</h1>
          <p className="text-gray-600">Barcha maydonlarni to'ldiring va e'lon bering</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl p-8 md:p-10 space-y-8">
          {/* 1-qator: UID + Name */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Package className="w-4 h-4 text-blue-600" />
                UID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.uid}
                onChange={(e) => setForm({ ...form, uid: e.target.value })}
                placeholder="aaadbb80-8c90-4a98-b4a2-c498e62f79a7"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
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
              <select
                value={form.owner}
                onChange={(e) => setForm({ ...form, owner: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Tanlang</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
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
                required
              >
                <option value="">Tanlang</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
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
              <option value="PENDING">Kutilmoqda</option>
              <option value="APPROVED">Tasdiqlangan</option>
              <option value="REJECTED">Rad etilgan</option>
            </select>
          </div>

          {/* Rasmlar */}
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
                      {photos[index] ? (
                        <img
                          src={photos[index]}
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
                Mahsulotni Qo'shish
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}