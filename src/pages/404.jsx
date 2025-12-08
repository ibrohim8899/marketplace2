// src/pages/NotFound.jsx
import { Home, Search, ArrowLeft, Frown, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 overflow-hidden">
      <div className={`max-w-2xl w-full text-center transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Animatsiyali 404 */}
        <div className="relative mb-8">
          {/* Orqa fon doiralari */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-200 rounded-full blur-2xl opacity-40 animate-pulse delay-100"></div>
          
          {/* 404 raqami */}
          <div className="relative py-12">
            <h1 className="text-9xl md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 animate-gradient">
              404
            </h1>
            
            {/* Yig'lagan emoji animatsiya */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bounce">
              <Frown className="w-16 h-16 text-purple-400 opacity-50" />
            </div>
          </div>
          
          {/* Suzuvchi elementlar */}
          <div className="absolute top-10 left-10 animate-float">
            <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
          </div>
          <div className="absolute top-20 right-16 animate-float-delayed">
            <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
          </div>
          <div className="absolute bottom-10 right-10 animate-float">
            <div className="w-4 h-4 bg-indigo-400 rounded-full"></div>
          </div>
        </div>

        {/* Matn qismi */}
        <div className="space-y-4 mb-8 px-4">
          <div className="flex items-center justify-center gap-2 text-purple-600">
            <MapPin className="w-5 h-5 animate-ping" />
            <span className="text-sm font-semibold uppercase tracking-wider">Sahifa topilmadi</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
            Siz adashib qolganga o'xshaysiz 🧭
          </h2>
          
          <p className="text-base md:text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
            Bu sahifa mavjud emas yoki ko'chirilgan. Keling, sizni to'g'ri yo'lga qaytaramiz!
          </p>
        </div>

        {/* Tugmalar */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6 px-4">
          <Link 
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <Home className="w-5 h-5" />
            Bosh sahifaga qaytish
          </Link>
          
          <Link 
            to="/search"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-gray-700 font-semibold rounded-xl shadow-md hover:shadow-xl border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 transform hover:scale-105"
          >
            <Search className="w-5 h-5" />
            Qidiruv
          </Link>
        </div>

        {/* Orqaga qaytish */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mx-auto text-gray-600 hover:text-purple-600 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Orqaga qaytish</span>
        </button>

        {/* Pastki qism */}
        <div className="mt-12 pt-6 border-t border-purple-100">
          <p className="text-xs md:text-sm text-gray-500">
            Yordam kerakmi?{' '}
            <Link to="/contact" className="text-purple-600 hover:text-pink-600 font-medium hover:underline transition-colors">
              Qo'llab-quvvatlash xizmati
            </Link>
            {' '}bilan bog'laning
          </p>
        </div>
      </div>

      {/* CSS Animatsiyalar */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite;
        }
        
        .delay-100 {
          animation-delay: 0.5s;
        }
      `}</style>
    </div>
  );
}