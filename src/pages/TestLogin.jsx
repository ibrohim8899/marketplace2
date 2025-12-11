// src/pages/TestLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";
import { useNotification } from "../context/NotificationContext";

export default function TestLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const success = await loginUser(email, password);
      if (success) {
        showNotification({
          type: "success",
          title: "Muvaffaqiyatli kirildi",
          message: "Endi savatcha va boshqa funksiyalar to'liq ishlaydi.",
        });
        navigate("/"); // Bosh sahifaga yo'naltiramiz
        window.location.reload(); // Tokenni axios ilib olishi uchun sahifani yangilaymiz
      } else {
        setError("Token kelmadi, backend javobini tekshiring.");
      }
    } catch (err) {
      setError("Login yoki parol xato!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Test Login</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parol</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border"
              placeholder="********"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Kirish
          </button>
        </form>
      </div>
    </div>
  );
}