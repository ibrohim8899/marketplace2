// src/pages/SearchResults.jsx
import { useLocation } from 'react-router-dom';
import ProductList from '../components/product/ProductList';
import Container from '../components/layout/Container';
import SearchFilter from '../components/product/SearchFilter';

export default function SearchResults() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchQuery = params.get('q') || '';
  const categoryFilter = params.get('category') || '';
  const min = params.get('min');
  const max = params.get('max');
  const locationFilter = params.get('location') || '';
  const priceRange = min && max ? { min: Number(min), max: Number(max) } : null;

  return (
    <div className="pt-16 pb-20 min-h-screen bg-gray-50">
      <Container>
        <div className="py-4 space-y-6">
          {/* Qidiruv sarlavhasi va izoh */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Qidiruv natijalari
            </h1>
            <p className="text-sm text-gray-600">
              Siz qidirgan so'z: <span className="font-semibold text-gray-900">"{searchQuery}"</span>
            </p>
          </div>

          {/* Qidiruv va filter paneli */}
          <div className="space-y-4">
            <div className="w-full bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm px-4 sm:px-6 py-3.5 sm:py-4 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 mr-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                  />
                </svg>
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-wide text-gray-400 mb-0.5">
                  Qidiruv so'zi
                </p>
                <p className="text-sm sm:text-base font-medium text-gray-900 truncate">
                  {searchQuery || 'Barcha mahsulotlar'}
                </p>
              </div>
              <span className="hidden sm:inline-flex text-xs font-medium text-gray-500 px-3 py-1 rounded-full bg-slate-100">
                Natijalar ro'yxati quyida
              </span>
            </div>

            {/* mavjud filter komponenti */}
            <SearchFilter
              initialQuery={searchQuery}
              initialCategory={categoryFilter}
              initialMin={min || ''}
              initialMax={max || ''}
              initialLocation={locationFilter}
            />
          </div>

          {/* Natijalar ro'yxati */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <ProductList searchQuery={searchQuery} categoryFilter={categoryFilter} priceRange={priceRange} locationFilter={locationFilter} />
          </div>
        </div>
      </Container>
    </div>
  );
}