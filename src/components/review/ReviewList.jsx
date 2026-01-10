// src/components/review/ReviewList.jsx
import { useState, useEffect } from 'react';

import { getComments, deleteComment, updateComment } from '../../api/comments';
import axiosInstance from '../../api/axiosInstance';
import { useNotification } from '../../context/NotificationContext';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function ReviewList({ productId, onCommentDeleted }) {
  const [comments, setComments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [expandedIds, setExpandedIds] = useState([]);
  const { showNotification } = useNotification();
  const { t } = useLanguage();

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

  // Joriy foydalanuvchini aniqlash
  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setCurrentUserId(null);
        return;
      }
      try {
        const { data } = await axiosInstance.get('/user/profile/');
        setCurrentUserId(data.uid || data.id || null);
      } catch (err) {
        console.error("Profil ma'lumotlari olinmadi (commentlar uchun):", err.response?.data || err.message);
        setCurrentUserId(null);
      }
    };

    loadProfile();
  }, []);

  const isOwner = (comment) => {
    if (!currentUserId || !comment) return false;

    const candidateIds = [];

    // owner may come in several shapes
    if (comment.owner_id) candidateIds.push(comment.owner_id);
    if (comment.owner) candidateIds.push(comment.owner);
    if (comment.owner?.uid) candidateIds.push(comment.owner.uid);
    if (comment.owner?.id) candidateIds.push(comment.owner.id);

    // some backends may use user / user_id
    if (comment.user_id) candidateIds.push(comment.user_id);
    if (comment.user?.uid) candidateIds.push(comment.user.uid);
    if (comment.user?.id) candidateIds.push(comment.user.id);

    return candidateIds
      .filter(Boolean)
      .some((val) => String(val) === String(currentUserId));
  };

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = async (comment) => {
    if (!isOwner(comment)) return;
    const id = comment.uid || comment.id;
    if (!id) return;
    setActionLoadingId(id);
    try {
      await deleteComment(id);
      showNotification({
        type: 'success',
        title: t('review_delete_success_title'),
        message: t('review_delete_success_message'),
      });
      await fetchComments();
      if (onCommentDeleted) onCommentDeleted();
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        (typeof err.response?.data === 'string' ? err.response.data : err.message);
      showNotification({
        type: 'error',
        title: t('review_delete_fail_title'),
        message: detail,
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const startEdit = (comment) => {
    if (!isOwner(comment)) return;
    const id = comment.uid || comment.id;
    setEditingId(id);
    setEditingText(comment.body || comment.text || comment.comment || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText('');
  };

  const handleUpdate = async (comment) => {
    if (!isOwner(comment)) return;
    const id = comment.uid || comment.id;
    if (!id) return;

    if (!editingText.trim()) {
      showNotification({
        type: 'warning',
        title: t('review_update_empty_title'),
        message: t('review_update_empty_message'),
      });
      return;
    }

    setActionLoadingId(id);
    try {
      await updateComment(id, editingText.trim());
      showNotification({
        type: 'success',
        title: t('review_update_success_title'),
        message: t('review_update_success_message'),
      });
      setEditingId(null);
      setEditingText('');
      await fetchComments();
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        (typeof err.response?.data === 'string' ? err.response.data : err.message);
      showNotification({
        type: 'error',
        title: t('review_update_fail_title'),
        message: detail,
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) return <p className="text-center text-gray-500 dark:text-slate-400">{t('review_loading')}</p>;

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-slate-400 py-8">{t('review_empty')}</p>
      ) : (
        comments.map((comment) => {
          const commentId = comment.uid || comment.id;
          const own = isOwner(comment);
          const isEditing = editingId === commentId;
          const isBusy = actionLoadingId === commentId;
          const displayText = isEditing
            ? editingText
            : (comment.body || comment.text || comment.comment);
          const isExpanded = expandedIds.includes(commentId);
          const shouldClamp = !isEditing && displayText && displayText.length > 200;

          return (
            <div
              key={commentId}
              className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 bg-white dark:bg-slate-900 hover:shadow-md transition-shadow"
            >
              {/* Commenter ma'lumotlari */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                    {comment.owner_name?.charAt(0) || comment.user?.first_name?.charAt(0) || comment.user?.email?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800 dark:text-slate-100">
                      {comment.owner_name || `${comment.user?.first_name} ${comment.user?.last_name || comment.user?.email}` || 'Noma\'lum'}
                    </div>

                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {new Date(comment.created_at).toLocaleDateString('uz-UZ')}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {own && (
                    <div className="flex gap-1">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleUpdate(comment)}
                            disabled={isBusy}
                            className="p-1.5 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-xs disabled:opacity-60 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-900/60"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={isBusy}
                            className="p-1.5 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 text-xs disabled:opacity-60 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(comment)}
                            className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs dark:bg-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-900/60"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(comment)}
                            disabled={isBusy}
                            className="p-1.5 rounded-full bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs disabled:opacity-60 dark:bg-rose-900/40 dark:text-rose-200 dark:hover:bg-rose-900/60"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Sharh matni */}
              {isEditing ? (
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="w-full border border-gray-300 dark:border-slate-700 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100"
                  rows={3}
                />
              ) : (
                <>
                  <p
                    className={`text-gray-700 dark:text-slate-200 leading-relaxed break-words ${
                      !isExpanded && shouldClamp ? 'line-clamp-2' : ''
                    }`}
                  >
                    {displayText}
                  </p>
                  {shouldClamp && (
                    <button
                      type="button"
                      onClick={() => toggleExpand(commentId)}
                      className="mt-1 text-xs font-medium text-blue-600 hover:underline"
                    >
                      {isExpanded ? t('review_show_less') : t('review_show_more')}
                    </button>
                  )}
                </>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}