// src/components/product/SearchFilter.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, X } from 'lucide-react';
import { getCategories } from '../../api/categories';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function SearchFilter({ initialQuery = '', initialMin = '', initialMax = '', initialLocation = '', initialCategory = '' }) {
	const [query, setQuery] = useState(initialQuery);
	const [min, setMin] = useState(initialMin);
	const [max, setMax] = useState(initialMax);
	const [location, setLocation] = useState(initialLocation);
	const [category, setCategory] = useState(initialCategory);
	const [categories, setCategories] = useState([]);
	const [categoriesLoading, setCategoriesLoading] = useState(false);
	const [showAdvanced, setShowAdvanced] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setCategoriesLoading(true);
		getCategories()
			.then((data) => {
				const cats = data.results || data;
				setCategories(Array.isArray(cats) ? cats : []);
			})
			.catch((err) => {
				console.error('Kategoriyalar yuklanmadi:', err);
				setCategories([]);
			})
			.finally(() => setCategoriesLoading(false));
	}, []);

	const handleSearch = (e) => {
		e.preventDefault();

		const params = new URLSearchParams();
		if (query.trim()) params.set('q', query.trim());
		if (category) params.set('category', category);
		if (min) params.set('min', min);
		if (max) params.set('max', max);
		if (location.trim()) params.set('location', location.trim());

		const searchString = params.toString();
		navigate(searchString ? `/search?${searchString}` : '/search');
	};

	const handleReset = () => {
		setQuery('');
		setMin('');
		setMax('');
		setLocation('');
		setCategory('');
		navigate('/search');
	};

	const hasFilters = query.trim() || category || min || max || location.trim();

	return (
		<form
			onSubmit={handleSearch}
			className="bg-gray-50 border border-slate-200 rounded-2xl shadow-sm px-4 sm:px-6 py-4 sm:py-5 space-y-4"
		>
			{/* Search Bar */}
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="flex-1 relative">
					<Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
					<Input
						placeholder="Tovar qidirish..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="w-full pl-10"
					/>
				</div>
				<div className="flex items-stretch gap-2 sm:w-auto">
					<Button type="submit" className="w-full sm:w-auto">
						Qidirish
					</Button>
					<button
						type="button"
						onClick={() => setShowAdvanced(!showAdvanced)}
						className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium text-gray-700"
					>
						<Filter className="w-4 h-4" />
						Filtrlar
					</button>
					{hasFilters && (
						<Button
							type="button"
							variant="secondary"
							onClick={handleReset}
							className="hidden sm:inline-flex gap-2"
						>
							<X className="w-4 h-4" />
							Tozalash
						</Button>
					)}
				</div>
			</div>

			{/* Advanced Filters */}
			{showAdvanced && (
				<div className="pt-4 border-t border-gray-200 space-y-4">
					{/* Category Filter */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Kategoriya
						</label>
						<select
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						>
							<option value="">Barcha kategoriyalar</option>
							{categoriesLoading ? (
								<option disabled>Yuklanmoqda...</option>
							) : (
								categories.map((cat) => (
									<option key={cat.uid} value={cat.name}>
										{cat.name}
									</option>
								))
							)}
						</select>
					</div>

					{/* Price Range */}
					<div className="grid grid-cols-2 gap-3">
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Min narx (so'm)
							</label>
							<Input
								type="number"
								min="0"
								placeholder="0"
								value={min}
								onChange={(e) => setMin(e.target.value)}
							/>
						</div>
						<div>
							<label className="block text-sm font-semibold text-gray-700 mb-2">
								Max narx (so'm)
							</label>
							<Input
								type="number"
								min="0"
								placeholder="999999999"
								value={max}
								onChange={(e) => setMax(e.target.value)}
							/>
						</div>
					</div>

					{/* Location Filter */}
					<div>
						<label className="block text-sm font-semibold text-gray-700 mb-2">
							Joylashuv
						</label>
						<Input
							placeholder="Masalan: Toshkent, Namangan"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
						/>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-2 pt-2">
						<Button type="submit" className="flex-1">
							Filtrlash
						</Button>
						<Button
							type="button"
							variant="secondary"
							onClick={handleReset}
							className="flex-1"
						>
							Tozalash
						</Button>
					</div>
				</div>
			)}

			{/* Active Filters Display */}
			{hasFilters && !showAdvanced && (
				<div className="flex flex-wrap gap-2 items-center text-sm">
					<span className="text-gray-600 font-medium">Faol filtrlar:</span>
					{query.trim() && (
						<span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
							Qidiruv: {query}
						</span>
					)}
					{category && (
						<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
							Kategoriya: {category}
						</span>
					)}
					{(min || max) && (
						<span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
							Narx: {min || '0'} - {max || '∞'}
						</span>
					)}
					{location.trim() && (
						<span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
							Joylashuv: {location}
						</span>
					)}
				</div>
			)}
		</form>
	);
}