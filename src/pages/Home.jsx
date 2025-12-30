// src/pages/Home.jsx
// import SearchFilter from '../components/product/SearchFilter';
import CategoryGrid from '../components/category/CategoryGrid';
import RecommendedProducts from '../components/product/RecommendedProducts';
import ProductList from '../components/product/ProductList';
import Container from '../components/layout/Container';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  return (
    <div>
      <Container>
        <div className="py-4 space-y-6">
          <div>
            <h2 className="text-xl font-bold mb-4">{t('home_categories')}</h2>
            <CategoryGrid />
          </div>
          
          {/* <div>
            <h2 className="text-xl font-bold mb-4">Tavsiya etilganlar</h2>
            <RecommendedProducts />
          </div> */}
          
          <div>
            <h2 className="text-xl font-bold mb-4">{t('home_all_products')}</h2>
            <ProductList />
          </div>
        </div>
      </Container>
    </div>
  );
}

