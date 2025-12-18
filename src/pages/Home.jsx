// src/pages/Home.jsx
// import SearchFilter from '../components/product/SearchFilter';
import CategoryGrid from '../components/category/CategoryGrid';
import RecommendedProducts from '../components/product/RecommendedProducts';
import ProductList from '../components/product/ProductList';
import Container from '../components/layout/Container';

export default function Home() {
  return (
    <div className="pt-16 pb-20 min-h-screen bg-gray-50">
      <Container>
        <div className="py-4 space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">Kategoriyalar</h2>
            <CategoryGrid />
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Tavsiya etilganlar</h2>
            <RecommendedProducts />
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Barcha tovarlar</h2>
            <ProductList />
          </div>
        </div>
      </Container>
    </div>
  );
}

