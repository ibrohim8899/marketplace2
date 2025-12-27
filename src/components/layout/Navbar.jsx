// src/components/layout/Navbar.jsx
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white z-20">
      <div className="max-w-screen-md mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">M</Link>

        <div className="flex gap-6 text-sm font-medium">
          <Link to="/seller" className="hover:text-blue-600">Sotuvchi</Link>
          {/* <Link to="/top-sellers" className="hover:text-blue-600">Top Sotuvchilar</Link> */}
        </div>
      </div>
    </nav>
  );
}