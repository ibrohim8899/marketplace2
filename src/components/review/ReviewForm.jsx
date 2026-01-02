// src/components/review/ReviewForm.jsx
import { useState } from 'react';
import Button from '../ui/Button';
import { createComment } from '../../api/comments';
import { useNotification } from '../../context/NotificationContext';
import { useLanguage } from '../../context/LanguageContext';

export default function ReviewForm({ productId, onAdded }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      setError(t('review_error_empty'));
      return;
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      const msg = t('review_login_required');
      setError(msg);
      showNotification({
        type: 'warning',
        title: t('review_login_required_title'),
        message: msg,
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createComment(productId, comment, rating);
      setComment('');
      setRating(5);
      if (onAdded) onAdded();

      showNotification({
        type: 'success',
        title: t('review_sent_title'),
        message: t('review_sent_message'),
      });
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        (typeof err.response?.data === 'string'
          ? err.response.data
          : err.message);
      const msg = t('review_error_prefix') + detail;
      setError(msg);
      showNotification({
        type: 'error',
        title: t('review_error_title'),
        message: detail,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl transition-all ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            ★
          </button>
        ))}
      </div>
      
      <textarea
        placeholder={t('review_placeholder')}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="border border-gray-300 rounded-lg py-2 px-3 w-full h-20 focus:ring-2 focus:ring-blue-500 resize-none"
      />
      
      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading ? t('review_submit_loading') : t('review_submit')}
      </Button>
    </form>
  );
}