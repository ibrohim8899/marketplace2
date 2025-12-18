# Marketplace - Web va Telegram WebApp uchun sozlash

## O'zgarishlar

### 1. API konfiguratsiyasi (Universal)
- `.env.development` - Lokal development uchun
- `.env.production` - Production/Telegram WebApp uchun
- `axiosInstance.js` - Environment variable ishlatadi

### 2. Telegram WebApp integratsiyasi
- Oddiy browserda xato bermaydi
- Telegram ichida avtomatik login ishlaydi
- `App.jsx` da to'g'rilandi

### 3. Stillar va containerlar
Barcha sahifalar endi bir xil stilga ega:
- `max-w-screen-md` - Bir xil kenglik
- `px-4 py-4` - Bir xil padding
- `bg-gray-50` - Bir xil fon
- `pt-16 pb-20` - Navbar va Footer uchun joy

## Sozlash

### Development (Lokal)
```bash
npm run dev
```
`.env.development` avtomatik ishlatiladi, `/api` proxy orqali backendga boradi.

### Production (Telegram WebApp)
1. `.env.production` faylini tahrirlang:
```env
VITE_API_BASE_URL=https://sizning-backend.com/api
```

2. Build qiling:
```bash
npm run build
```

3. `dist` papkasini hosting ga yuklang (Netlify, Vercel, va h.k.)

## Telegram WebApp sozlash

1. BotFather orqali Web App URL ni o'rnating:
```
/newapp
/mybots -> [botingiz] -> Bot Settings -> Menu Button -> Configure Menu Button
```

2. URL: `https://sizning-domen.com`

3. Telegram bot kodida:
```python
from telegram import WebAppInfo, KeyboardButton, ReplyKeyboardMarkup

button = KeyboardButton(
    text="🛒 Bozorga kirish",
    web_app=WebAppInfo(url="https://sizning-domen.com")
)
keyboard = ReplyKeyboardMarkup([[button]], resize_keyboard=True)
```

## Xususiyatlar

✅ Oddiy browserda ishlaydi
✅ Telegram WebApp ichida ishlaydi  
✅ Bir xil stillar va containerlar
✅ Responsive dizayn
✅ Sevimlilar localStorage'da saqlanadi
✅ Auto-login Telegram'da

## Muhim fayllar

- `src/api/axiosInstance.js` - API konfiguratsiyasi
- `src/App.jsx` - Telegram integratsiyasi
- `src/pages/Home.jsx` - Bosh sahifa
- `src/pages/Categories.jsx` - Kategoriyalar
- `src/pages/SearchResults.jsx` - Qidiruv
- `src/pages/Wishlist.jsx` - Sevimlilar
- `src/components/layout/Container.jsx` - Universal container

## Muammolar va yechimlar

### Mahsulotlar ko'rinmasa:
1. Network tabda `/api/product/products/` so'rovini tekshiring
2. Console'da xatolarni ko'ring
3. `.env.production` da to'g'ri URL borligini tekshiring

### Telegram'da ishlamasa:
1. HTTPS ishlatilganini tekshiring (HTTP ishlamaydi)
2. Backend CORS sozlamalarini tekshiring
3. Telegram bot settings'da to'g'ri URL borligini tekshiring
