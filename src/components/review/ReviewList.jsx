// src/components/review/ReviewList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getComments } from '../../api/comments';
import { User, Trash2 } from 'lucide-react';

export default function ReviewList({ productId, onCommentDeleted }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const data = await getComments(productId);
      setComments(data);
    } catch (err) {
      console.error('Commentlarni yuklashda xatolik:', err);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [productId]);

  const handleRefresh = () => {
    fetchComments();
    if (onCommentDeleted) onCommentDeleted();
  };

  if (loading) return <p className="text-center text-gray-500">Yuklanyapti...</p>;

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <p className="text-center text-gray-500 py-8">Hali sharhlar yo'q</p>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
            {/* Commenter ma'lumotlari */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {comment.user?.first_name?.charAt(0) || comment.user?.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <Link
                    to={`/profile/${comment.user?.id}`}
                    className="font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                  >
                    {comment.user?.first_name} {comment.user?.last_name || comment.user?.email || 'Noma\'lum'}
                  </Link>
                  <p className="text-xs text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString('uz-UZ')}
                  </p>
                </div>
              </div>
              
              {/* Reyting */}
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < (comment.rating || 5) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>

            {/* Sharh matni */}
            <p className="text-gray-700 leading-relaxed">{comment.body || comment.text || comment.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}