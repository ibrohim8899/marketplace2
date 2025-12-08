// src/components/common/EmptyState.jsx
export default function EmptyState({ message = 'Hech nima topilmadi' }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-gray-500">
      <span className="text-5xl mb-2">🤷‍♂️</span>
      <p className="font-medium">{message}</p>
    </div>
  );
}