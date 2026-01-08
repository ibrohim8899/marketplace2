// src/components/ui/Button.jsx
export default function Button({ children, className = '', variant = 'primary', ...props }) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
    outline: 'text-gray-800 border border-gray-300 hover:bg-gray-50 dark:text-slate-100 dark:border-slate-600 dark:hover:bg-slate-900',
  };

  return (
    <button
      className={`py-2 px-4 rounded-lg font-medium transition-colors ${variants[variant] || ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}