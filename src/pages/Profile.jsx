import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Star,
  MessageCircle,
  Briefcase,
  Languages,
  LogOut,
  LogIn,
} from "lucide-react";

export default function ProfileCard() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({
    firstName: "Ibrahim",
    lastName: "Xolmirzaev",
    rating: 4.8,
    reviews: 127,
    bio: "Men 5 yildan beri onlayn savdo va freelancing bilan shug'ullanaman. Raqamli marketing, SMM, veb-sayt yaratish va elektron tijorat bo'yicha mutaxassisman.",
    email: "ibrahim@example.com",
    phone: "+998 90 123-45-67",
    location: "Toshkent, O'zbekiston",
    website: "ibrahim.uz",
    joined: "Yanvar 2021",
    languages: ["O'zbek", "Русский", "English"],
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const raw = localStorage.getItem("user_profile");

    if (token && raw) {
      setIsLoggedIn(true);
      try {
        const parsed = JSON.parse(raw);

        setUser((prev) => ({
          ...prev,
          firstName:
            parsed.first_name ||
            parsed.firstName ||
            prev.firstName,
          lastName:
            parsed.last_name ||
            parsed.lastName ||
            prev.lastName,
          email: parsed.email || prev.email,
          phone:
            parsed.phone ||
            parsed.phone_number ||
            parsed.phoneNumber ||
            prev.phone,
          location:
            parsed.location ||
            parsed.address ||
            prev.location,
          website:
            parsed.website ||
            parsed.site ||
            prev.website,
          joined:
            parsed.joined ||
            parsed.date_joined ||
            parsed.created_at ||
            prev.joined,
          languages:
            Array.isArray(parsed.languages) && parsed.languages.length > 0
              ? parsed.languages
              : prev.languages,
        }));
      } catch (err) {
        console.error("Profil ma'lumotlarini o'qishda xatolik:", err);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_profile");
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleLogin = () => {
    // Login sahifasiga o'tish
    navigate('/login');
  };

  return (
    <div className="inset-0 flex flex-col">
      
      {/* Asosiy kontent – scroll yo'q */}
      <div className="flex-1 overflow-hidden px-4 py-20">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* YONMA-YON HEADER: Avatar + Ism + Reyting */}
            <div className="px-6 pt-8 pb-6 bg-gradient-to-br from-indigo-50 to-purple-50">
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white">
                    IX
                  </div>
                </div>

                {/* Ism, kasb, reyting */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-indigo-600 font-medium flex items-center gap-1.5 mt-1 text-sm">
                    <Briefcase className="w-4 h-4" />
                    Freelancer & Onlayn Sotuvchi
                  </p>

                  {/* Reyting */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < user.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="font-bold text-gray-800">{user.rating}</span>
                    <span className="text-gray-500 text-xs">({user.reviews} sharh)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="px-6 py-5">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
                <p className="text-gray-700 text-xs leading-tight">
                  {user.bio}
                </p>
              </div>
            </div>

            {/* Kontaktlar – 2 ustun */}
            <div className="px-6 pb-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex gap-2.5 bg-gray-50 rounded-xl p-3 items-start">
                  <Mail className="w-4 h-4 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-800 break-all">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-2.5 bg-gray-50 rounded-xl p-3 items-start">
                  <Phone className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-gray-500">Telefon</p>
                    <p className="font-medium text-gray-800">{user.phone}</p>
                  </div>
                </div>
                <div className="flex gap-2.5 bg-gray-50 rounded-xl p-3 items-start">
                  <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-gray-500">Manzil</p>
                    <p className="font-medium text-gray-800">{user.location}</p>
                  </div>
                </div>
                <div className="flex gap-2.5 bg-gray-50 rounded-xl p-3 items-start">
                  <Globe className="w-4 h-4 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-gray-500">Veb-sayt</p>
                    <a href={`https://${user.website}`} className="font-medium text-indigo-600 underline">
                      {user.website}
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2.5 bg-gray-50 rounded-xl p-3 text-xs">
                <Calendar className="w-4 h-4 text-orange-600" />
                <div>
                  <p className="text-gray-500">A’zo bo’lgan</p>
                  <p className="font-medium text-gray-800">{user.joined}</p>
                </div>
              </div>
            </div>

            {/* Tillar */}
            <div className="px-6 pb-6">
              <div className="flex items-center gap-2 mb-3">
                <Languages className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Gaplashadigan tillar</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.languages.map((lang) => (
                  <span key={lang} className="px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login/Logout tugmalari */}
      <div className="bottom-20 left-0 right-0 px-6 z-50">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="w-full max-w-md mx-auto bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 rounded-2xl shadow-xl flex items-center justify-center gap-2.5 text-sm hover:scale-105 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Chiqish
          </button>
        ) : (
          <button
            onClick={handleLogin}
            className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 rounded-2xl shadow-xl flex items-center justify-center gap-2.5 text-sm hover:scale-105 transition-all"
          >
            <LogIn className="w-5 h-5" />
            Kirish
          </button>
        )}
      </div>

      {/* Pastki nav bar joyi */}
      <div className="h-20 flex-shrink-0" />
    </div>
  );
}