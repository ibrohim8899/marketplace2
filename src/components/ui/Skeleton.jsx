// src/components/ui/Skeleton.jsx
export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-700/80 ${className}`} />;
}