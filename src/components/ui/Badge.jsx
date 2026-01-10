// src/components/ui/Badge.jsx
export default function Badge({ children, className = '' }) {
  return <span className={`bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200 text-xs px-2 py-1 rounded-full ${className}`}>{children}</span>;
}