// src/api/sellers.js
export const getSellers = async () => {
  // Dummy sellers
  return [
    { id: 1, name: 'Seller A', rating: 4.7, sales: 150, username: 'sellera' },
    { id: 2, name: 'Seller B', rating: 4.9, sales: 220, username: 'sellerb' },
    { id: 3, name: 'Seller C', rating: 4.5, sales: 100, username: 'sellerc' },
  ];
};

export const getTopSellers = async () => {
  const sellers = await getSellers();
  return sellers.sort((a, b) => b.sales - a.sales);
};