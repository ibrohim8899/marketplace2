import Button from "../ui/Button";
import { User, Star } from "lucide-react";

// src/components/seller/SellerCard.jsx
export default function SellerCard({ seller }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
      {/* User icon */}
      <div className="w-12 h-12 rounded-full flex items-center justify-center">
        <User className="w-6 h-6 text-blue-500" />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold">{seller.name}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {/* Star icon */}
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" /> {seller.rating.toFixed(1)}
          </span>
          <span>• {seller.sales} sotuv</span>
        </div>
      </div>

      <Button variant="secondary" className="text-xs">Ko'rish</Button>
    </div>
  );
}

