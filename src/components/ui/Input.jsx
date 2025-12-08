// src/components/ui/Input.jsx
export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`border border-gray-300 rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-600 transition-colors ${className}`}
      {...props}
    />
  );
}