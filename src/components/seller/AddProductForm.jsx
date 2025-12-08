// src/components/seller/AddProductForm.jsx
import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function AddProductForm({ onSubmit }) {
  const [form, setForm] = useState({ title: '', price: '', description: '', category: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ title: '', price: '', description: '', category: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input name="title" placeholder="Tovar nomi" value={form.title} onChange={handleChange} />
      <Input name="price" type="number" placeholder="Narxi" value={form.price} onChange={handleChange} />
      <Input name="category" placeholder="Kategoriya" value={form.category} onChange={handleChange} />
      <textarea
        name="description"
        placeholder="Tavsif"
        value={form.description}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg py-2 px-3 w-full h-24 focus:outline-none focus:border-blue-600"
      />
      <Button type="submit" className="w-full">Tovar qo'shish</Button>
    </form>
  );
}