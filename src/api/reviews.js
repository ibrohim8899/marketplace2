// src/api/reviews.js
export const getReviews = async (productId) => {
  // Dummy reviews
  return [
    { id: 1, user: 'User1', rating: 5, comment: 'Ajoyib tovar!' },
    { id: 2, user: 'User2', rating: 4, comment: 'Yaxshi, lekin...' },
  ];
};

export const addReview = async (productId, review) => {
  console.log('Yangi sharh qo‘shildi:', productId, review);
  return { success: true };
};