// src/components/layout/Container.jsx
export default function Container({ children, className = '' }) {
  return <div className={`max-w-screen-md mx-auto px-4 ${className}`}>{children}</div>;
}