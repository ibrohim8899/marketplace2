// src/components/common/LoadingSpinner.jsx
export default function LoadingSpinner() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 flex justify-center items-center px-4">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent" />
    </div>
  );
}