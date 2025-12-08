import { Routes, Route } from 'react-router-dom'; // Agar yo'q bo'lsa qo'shing
import Home from './pages/Home';
import Categories from './pages/Categories'; // Bu sahifa endi UID orqali ishlaydi
import ProductDetailPage from './pages/ProductDetailPage';
import SellerDashboard from './components/seller/SellerDashboard';
import TopSellers from './pages/TopSellers';
import SearchResults from './pages/SearchResults';
import ProfileCard from './pages/Profile';
import LoginPage from './pages/LoginPage';
import Breadcrumb from './components/layout/Breadcrumb';
import NotFound from './pages/404';
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Navbar from './components/layout/Navbar'; // Agar yo'q bo'lsa, qo'shing
import Footer from './components/layout/Footer'; // Agar yo'q bo'lsa, qo'shing

export default function App() {
  return (
    <CartProvider>
      <Navbar />
      <Breadcrumb />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:uid" element={<Categories />} /> {/* UID orqali o'zgartirdim */}
        <Route path="/product/:uid" element={<ProductDetailPage />} /> {/* :id → :uid qildim, logik bo'lsin */}
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/top-sellers" element={<TopSellers />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/profile" element={<ProfileCard />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<Cart />} /> 
        <Route path="/wishlist" element={<Wishlist />} /> 
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </CartProvider>
  );
}