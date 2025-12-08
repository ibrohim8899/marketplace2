// src/pages/Home.jsx
// import SearchFilter from '../components/product/SearchFilter';
import CategoryGrid from '../components/category/CategoryGrid';
import RecommendedProducts from '../components/product/RecommendedProducts';
import ProductList from '../components/product/ProductList';
import Container from '../components/layout/Container';

export default function Home() {
  return (
    <div className="pt-16 pb-20 min-h-screen">
      <Container>
        {/* <SearchFilter /> */}
        <h2 className="text-xl font-bold mb-4">Kategoriyalar</h2>
        <CategoryGrid />
        <h2 className="text-xl font-bold my-6">Tavsiya etilganlar</h2>
        <RecommendedProducts />
        <h2 className="text-xl font-bold my-6">Barcha tovarlar</h2>
        <ProductList />
      </Container>
    </div>
  );
}

