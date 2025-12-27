import { X, CheckCircle2, AlertTriangle, Info, AlertCircle } from 'lucide-react';

const iconByType = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export default function ToastContainer({ toasts, onClose }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed inset-x-0 top-4 z-[9999] flex flex-col items-center gap-3 pointer-events-none">
      {toasts.map((toast) => {
        const Icon = iconByType[toast.type] || Info;
        return (
          <div
            key={toast.id}
            className="pointer-events-auto w-full max-w-md shadow-lg rounded-2xl border border-gray-200 bg-white/95 px-4 py-3 flex items-start gap-3 transform transition-all duration-300 animate-slide-in backdrop-blur-sm"
          >
            <div className="mt-0.5 flex-shrink-0">
              <Icon className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex-1 min-w-0">
              {toast.title && (
                <p className="text-sm sm:text-base font-semibold leading-snug truncate">
                  {toast.title}
                </p>
              )}
              {toast.message && (
                <p className="mt-1 text-sm leading-snug text-gray-700">
                  {toast.message}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
