// src/components/category/SubCategoryList.jsx
// Dummy subcategories for now
export default function SubCategoryList({ category }) {
  const subs = ['Sub1', 'Sub2', 'Sub3']; // Realda API dan olish

  return (
    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
      {subs.map((sub) => (
        <button key={sub} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm whitespace-nowrap hover:bg-gray-300 transition-colors">
          {sub}
        </button>
      ))}
    </div>
  );
}