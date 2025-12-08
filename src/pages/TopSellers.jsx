// src/pages/TopSellers.jsx
import { useState, useEffect } from 'react';
import SellerCard from '../components/seller/SellerCard';
import { getTopSellers } from '../api/sellers';
import Container from '../components/layout/Container';

export default function TopSellers() {
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    getTopSellers().then(setSellers).catch(console.error);
  }, []);

  return (
    <div className="pt-16 pb-20 min-h-screen">
      <Container>
        <h1 className="text-2xl font-bold mb-6">Top Sotuvchilar</h1>
        <div className="space-y-4">
          {sellers.map((seller) => <SellerCard key={seller.id} seller={seller} />)}
        </div>
      </Container>
    </div>
  );
}