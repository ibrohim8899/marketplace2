// src/components/product/SearchFilter.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function SearchFilter() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 mb-6">
      <Input placeholder="Tovar qidirish..." value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1" />
      <Button type="submit">Qidirish</Button>
    </form>
  );
}