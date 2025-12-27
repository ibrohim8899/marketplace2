// // src/pages/Categories.jsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductList from "../components/product/ProductList";
import Container from "../components/layout/Container";
import { getCategories } from "../api/categories";

export default function Categories() {
  const { uid } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        if (uid === 'all') {
          // "Barcha" bosilgan – barcha tovarlar uchun
          setCategoryName('Barcha tovarlar');
          setLoading(false);
          return;
        }

        const data = await getCategories();
        const cats = data.results || data;
        const found = cats.find(cat => cat.uid === uid);
        if (found) {
          setCategoryName(found.name);
        } else {
          setCategoryName('Kategoriya topilmadi');
        }
      } catch (err) {
        console.error(err);
        setCategoryName('Xato');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [uid]);

  if (loading) {
    return <div className="text-center py-10">Yuklanmoqda...</div>;
  }

  return (
    <div>
      <Container>
        <div className="py-4 space-y-6">
          <h1 className="text-2xl font-bold">{categoryName}</h1>
          <ProductList category={uid === 'all' ? null : categoryName} />
        </div>
      </Container>
    </div>
  );
}


