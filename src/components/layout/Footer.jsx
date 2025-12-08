
// src/components/layout/Footer.jsx
import { NavLink } from 'react-router-dom';
import { HomeIcon, Search, CircleUserRound, ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Footer() {
  const { getTotalItems, wishlist } = useCart();
  const cartCount = getTotalItems();
  const wishlistCount = wishlist.length;

  const activeClass = "text-blue-600";
  const defaultClass = "text-gray-600";

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-20">
      <div className="max-w-screen-md mx-auto px-2 py-2">
        <div className="flex justify-around items-center">
          {/* Bosh sahifa */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive ? activeClass : defaultClass
              }`
            }
          >
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs font-medium">Bosh</span>
          </NavLink>

          {/* Qidiruv */}
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive ? activeClass : defaultClass
              }`
            }
          >
            <Search className="w-6 h-6" />
            <span className="text-xs font-medium">Qidiruv</span>
          </NavLink>

          {/* Sevimlilar */}
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all relative ${
                isActive ? activeClass : defaultClass
              }`
            }
          >
            <div className="relative">
              <Heart className={`w-6 h-6 ${wishlistCount > 0 ? 'fill-current' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">Sevimli</span>
          </NavLink>

          {/* Savatcha */}
          {/* <NavLink
            to="/cart"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all relative ${
                isActive ? activeClass : defaultClass
              }`
            }
          >
            <div className="relative">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
            <span className="text-xs font-medium">Savatcha</span>
          </NavLink> */}

          {/* Profil */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive ? activeClass : defaultClass
              }`
            }
          >
            <CircleUserRound className="w-6 h-6" />
            <span className="text-xs font-medium">Profil</span>
          </NavLink>
        </div>
      </div>
    </footer>
  );
}
