// src/components/product/SearchFilter.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function SearchFilter({ initialQuery = '', initialMin = '', initialMax = '', initialLocation = '' }) {
	const [query, setQuery] = useState(initialQuery);
	const [min, setMin] = useState(initialMin);
	const [max, setMax] = useState(initialMax);
	const [location, setLocation] = useState(initialLocation);
	const navigate = useNavigate();

	const handleSearch = (e) => {
		e.preventDefault();

		const params = new URLSearchParams();
		if (query.trim()) params.set('q', query.trim());
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
		navigate('/search');
	};

	return (
		<form
			onSubmit={handleSearch}
			className="bg-white/90 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm px-4 sm:px-6 py-4 sm:py-5 space-y-4"
		>
			<div className="flex flex-col sm:flex-row gap-3">
				<div className="flex-1">
					<Input
						placeholder="Tovar qidirish..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="w-full"
					/>
				</div>
				<div className="flex items-stretch gap-2 sm:w-auto">
					<Button type="submit" className="w-full sm:w-auto">
						Qidirish
					</Button>
					<Button
						type="button"
						variant="secondary"
						className="hidden sm:inline-flex"
						onClick={handleReset}
					>
						Tozalash
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
				<div>
					<Input
						type="number"
						min="0"
						placeholder="Min narx"
						value={min}
						onChange={(e) => setMin(e.target.value)}
					/>
				</div>
				<div>
					<Input
						type="number"
						min="0"
						placeholder="Max narx"
						value={max}
						onChange={(e) => setMax(e.target.value)}
					/>
				</div>
				<div>
					<Input
						placeholder="Joylashuv (masalan, Toshkent)"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
					/>
				</div>
			</div>
		</form>
	);
}