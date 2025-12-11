import { X } from 'lucide-react';

const typeStyles = {
  success: 'border-emerald-500/80 bg-emerald-50 text-emerald-900',
  error: 'border-rose-500/80 bg-rose-50 text-rose-900',
  warning: 'border-amber-500/80 bg-amber-50 text-amber-900',
  info: 'border-sky-500/80 bg-sky-50 text-sky-900',
};

export default function ToastContainer({ toasts, onClose }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => {
        const style = typeStyles[toast.type] || typeStyles.info;
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto shadow-lg rounded-2xl border px-4 py-3 flex items-start gap-3 transform transition-all duration-300 animate-slide-in ${style}`}
          >
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-sm font-semibold leading-tight truncate">{toast.title}</p>
              )}
              {toast.message && (
                <p className="mt-0.5 text-xs leading-snug text-gray-700 line-clamp-3">{toast.message}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onClose(toast.id)}
              className="ml-1 inline-flex items-center justify-center rounded-full p-1.5 text-xs text-gray-500 hover:bg-black/5 hover:text-gray-700 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
