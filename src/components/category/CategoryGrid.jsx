// import { useRef, useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// export default function CategorySlider() {
//   const scrollRef = useRef(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true);

//   const categories = [
//     "mens-watches",
//     "mobile-accessories",
//     "motorcycle",
//     "skin-care",
//     "smartphones",
//     "sports",
//     "fragrances",
//     "laptops",
//     "groceries",
//     "home-decoration",
//   ];

//   const checkScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     setCanScrollLeft(el.scrollLeft > 0);
//     setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
//   };

//   const scrollLeft = () => {
//     scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
//   };

//   const scrollRight = () => {
//     scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
//   };

//   useEffect(() => {
//     const el = scrollRef.current;
//     if (!el) return;
//     checkScroll();
//     el.addEventListener("scroll", checkScroll);
//     window.addEventListener("resize", checkScroll);
//     return () => {
//       el.removeEventListener("scroll", checkScroll);
//       window.removeEventListener("resize", checkScroll);
//     };
//   }, []);

//   const arrowBaseClasses =
//     "absolute top-1/2 -translate-y-1/2 z-10 bg-white shadow-md w-8 h-8 flex items-center justify-center rounded-full hover:scale-110 transition";

//   return (
//     <div className="relative w-full">
//       {/* Left Button */}
//       <button
//         onClick={scrollLeft}
//         className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 
//                 bg-white shadow-md w-8 h-8 flex items-center justify-center 
//                 rounded-full hover:scale-110 transition
//                 ${canScrollLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
//       >
//         <ChevronLeft size={18} />
//       </button>

//       {/* Scrollable Categories */}
//       <div
//         ref={scrollRef}
//         className="flex gap-2 overflow-x-auto no-scrollbar scrollbar-none pt-1 pb-1
//                scroll-smooth"
//         style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }} // arrowlar joyini hisobga olish
//       >
//         {categories.map((cat, index) => (
//           <Link
//             key={index}
//             to={`/category/${cat}`}
//             className="min-w-max px-3 py-2 bg-white rounded-lg shadow 
//                    text-xs font-medium cursor-pointer hover:bg-gray-100 capitalize"
//           >
//             {cat.replace("-", " ")}
//           </Link>
//         ))}
//       </div>

//       {/* Right Button */}
//       <button
//         onClick={scrollRight}
//         className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 
//                 bg-white shadow-md w-8 h-8 flex items-center justify-center 
//                 rounded-full hover:scale-110 transition
//                 ${canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
//       >
//         <ChevronRight size={18} />
//       </button>
//     </div>

//   );
// }



// import { useRef, useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { getCategories } from "../../api/categories"; // To'g'ri yo'lni tekshiring!

// export default function CategorySlider() {
//   const scrollRef = useRef(null);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(true);

//   // Backenddan kategoriyalarni olish
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setLoading(true);
//         const data = await getCategories(); // Bu yerda backenddan massourage keladi
//         setCategories(data.results || data); // Agar pagination bo‘lsa .results, yo‘q bo‘lsa to‘g‘ridan-to‘g‘ri
//         setError(null);
//       } catch (err) {
//         console.error("Kategoriyalar yuklanmadi:", err);
//         setError("Kategoriyalar yuklanmadi");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   // Scroll holatini tekshirish
//   const checkScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     setCanScrollLeft(el.scrollLeft > 0);
//     setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
//   };

//   const scrollLeft = () => {
//     scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
//   };

//   const scrollRight = () => {
//     scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
//   };

//   useEffect(() => {
//     const el = scrollRef.current;
//     if (!el) return;

//     checkScroll();
//     el.addEventListener("scroll", checkScroll);
//     window.addEventListener("resize", checkScroll);

//     return () => {
//       el.removeEventListener("scroll", checkScroll);
//       window.removeEventListener("resize", checkScroll);
//     };
//   }, [categories]); // categories yuklanganda ham yangilansin

//   // Agar hali yuklansa yoki xato bo‘lsa
//   if (loading) {
//     return (
//       <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-4">
//         {[...Array(6)].map((_, i) => (
//           <div
//             key={i}
//             className="min-w-max px-4 py-2 bg-gray-200 rounded-lg animate-pulse"
//           >
//             <div className="h-4 bg-gray-300 rounded w-20"></div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="text-red-500 text-center py-4">{error}</div>;
//   }

//   return (
//     <div className="relative w-full">
//       {/* Left Arrow */}
//       <button
//         onClick={scrollLeft}
//         className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md w-8 h-8 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-200
//           ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}
//       >
//         <ChevronLeft size={18} />
//       </button>

//       {/* Categories List */}
//       <div
//         ref={scrollRef}
//         className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth py-2"
//         style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
//       >
//         {categories.map((category) => (
//           <Link
//             key={category.uid} // uid bo‘yicha unique
//             to={`/category/${category.uid}`} // yoki category.name ni slug qilish mumkin
//             className="min-w-max px-4 py-2 bg-white rounded-lg shadow hover:shadow-lg 
//                        text-sm font-medium cursor-pointer hover:bg-gray-50 transition 
//                        capitalize whitespace-nowrap border border-gray-200"
//           >
//             {category.name}
//           </Link>
//         ))}
//       </div>

//       {/* Right Arrow */}
//       <button
//         onClick={scrollRight}
//         className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md w-8 h-8 flex items-center justify-center rounded-full hover:scale-110 transition-all duration-200
//           ${canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"}`}
//       >
//         <ChevronRight size={18} />
//       </button>
//     </div>
//   );
// }

// src/components/category/CategoryGrid.jsx
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCategories } from "../../api/categories";

export default function CategorySlider() {
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    getCategories()
      .then(data => {
        const cats = data.results || data;
        // Qo‘shimcha "Barcha" kategoriyasini eng boshiga qo‘shamiz
        const allCategories = [
          { uid: 'all', name: 'Barcha' }, // Maxsus UID va name
          ...cats
        ];
        setCategories(allCategories);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Qolgan kod o‘zgarmaydi (checkScroll, scrollLeft, va h.k.)
  const checkScroll = () => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll);
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [categories]);

  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 px-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="min-w-max px-4 py-2 bg-gray-200 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <button
        onClick={scrollLeft}
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md w-8 h-8 flex items-center justify-center rounded-full hover:scale-110 transition
          ${canScrollLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <ChevronLeft size={18} />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth pt-1 pb-1"
        style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.uid}
            to={`/category/${cat.uid}`} // UID bo‘yicha, "all" uchun /category/all
            className="min-w-max px-3 py-2 bg-white rounded-lg shadow text-xs font-medium cursor-pointer hover:bg-gray-100 capitalize"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <button
        onClick={scrollRight}
        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md w-8 h-8 flex items-center justify-center rounded-full hover:scale-110 transition
          ${canScrollRight ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}