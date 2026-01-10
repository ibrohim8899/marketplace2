// src/components/ui/Input.jsx
export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`border border-gray-300 dark:border-slate-700 rounded-lg py-2 px-3 w-full bg-white dark:bg-slate-900 text-gray-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 focus:ring-1 focus:ring-blue-600/60 transition-colors ${className}`}
      {...props}
    />
  );
}